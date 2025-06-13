# Copyright 2025 Sony Semiconductor Solutions Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
import logging
from datetime import datetime

from app.client.client_factory import get_api_client
from app.client.client_interface import ClientInferface
from app.config.app_config import load_app_config_from_yaml
from app.data_management.device_stream import filter_human_detections
from app.data_management.human_detection import create_human_detection_counter
from app.data_management.object_detection.inference_deserialization import deserialize
from app.data_management.object_detection.inference_deserialization import (
    detection_data_to_json,
)
from app.schemas.common import SolutionType
from app.schemas.insight import ImageDirectories
from app.schemas.insight import ImagesAndInferences
from app.schemas.insight import Inferences
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/insight", tags=["Insight"])


@router.get("/directories/{device_id}", response_model=ImageDirectories)
async def get_image_directories(
    device_id: str, api_client: ClientInferface = Depends(get_api_client)
) -> ImageDirectories:
    """Get image directories of the device.

    Args:
        device_id (str): Device ID

    Returns:
        ImageDirectories: Pydantic model containing a list of image directories.
    """
    logger.debug(f"Received request to get image directories for device: {device_id}")
    try:
        directories = api_client.get_image_directories(device_id=device_id)
        logger.info(f"Successfully retrieved image directories for device: {device_id}")
        return directories
    except Exception as e:
        logger.error(
            f"Error while retrieving image directories for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/images_and_inferences/{device_id}/{sub_directory_name}",
    response_model=ImagesAndInferences,
)
async def get_images_and_inferences(
    device_id: str,
    sub_directory_name: str,
    solution_type: SolutionType = Query(SolutionType.people_count),
    api_client: ClientInferface = Depends(get_api_client),
):
    """Get the list of images and inferences.

    Args:
        device_id (str): Device ID
        sub_directory_name (str): Name of directory where images are stored

    Returns:
        ImagesAndInferences: Pydantic model containing a list of images and inferences
    """
    logger.debug(
        f"Received request to get images and inferences for device: {device_id}"
    )
    try:
        image_and_inference_list = api_client.get_images_and_inferences(
            device_id=device_id, sub_directory_name=sub_directory_name
        )

        app_config = load_app_config_from_yaml()
        counter = create_human_detection_counter(solution_type, app_config)

        for data in image_and_inference_list:
            if data["inference"]:
                deserialize_inference = deserialize(data["inference"])
                parsed_inference = filter_human_detections(
                    detection_data_to_json(deserialize_inference)
                )
                data["inference"] = counter.add_processed_data(
                    filter_human_detections(parsed_inference)
                )
        logger.info(
            f"Successfully retrieved images and inferences for device: {device_id}"
        )
        return ImagesAndInferences(data=image_and_inference_list)
    except Exception as e:
        logger.error(
            f"Error while retrieving images and inferences for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/inferences/{device_id}",
    response_model=Inferences,
)
async def get_inferences(
    device_id: str,
    from_datetime: datetime = Query(...),
    to_datetime: datetime = Query(...),
    solution_type: SolutionType = Query(SolutionType.people_count),
    api_client: ClientInferface = Depends(get_api_client),
) -> Inferences:
    """Get the list of inferences.

    Args:
        device_id (str): Device ID
        from_datetime (datetime): Start datetime for filtering inferences as ISO 8601 string
        to_datetime (datetime): End datetime for filtering inferences as ISO 8601 string
        solution_type (SolutionType): The type of solution to process

    Returns:
        Inferences: Pydantic model containing a paginated list of inferences
    """
    logger.debug(f"Received request to get inferences for device: {device_id}")
    try:
        raw_inferences = api_client.get_inferences(
            device_id=device_id, from_datetime=from_datetime, to_datetime=to_datetime
        )

        app_config = load_app_config_from_yaml()
        counter = create_human_detection_counter(solution_type, app_config)

        data = []
        for raw_inference in raw_inferences:
            if raw_inference["timestamp"]:
                deserialize_inference = deserialize(raw_inference["inference"])
                parsed_inference = filter_human_detections(
                    detection_data_to_json(deserialize_inference)
                )
                inference = counter.add_processed_data(parsed_inference)
                data.append(
                    {
                        "timestamp": raw_inference["timestamp"],
                        "inference": inference,
                    }
                )
        logger.info(f"Successfully retrieved inferences for device: {device_id}")
        return Inferences(data=data)
    except Exception as e:
        logger.error(
            f"Error while retrieving retrieved inferences for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))
