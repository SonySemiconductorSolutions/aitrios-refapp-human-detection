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
import asyncio
import logging

from app.client.client_factory import get_api_client
from app.client.client_interface import ClientInferface
from app.routers.dependencies import InjectDataPipeline
from app.schemas.common import SolutionType
from app.schemas.common import StatusResponse
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/processing", tags=["Processing"])

active_data_pipeline = asyncio.Event()


@router.get("/image/{device_id}", response_model=str)
async def get_image(
    device_id: str, api_client: ClientInferface = Depends(get_api_client)
) -> str:
    """Get image from device.

    Args:
        device_id (str): Device ID

    Returns:
        str: Image in base64 format
    """
    logger.debug(f"Received request to get image for device: {device_id}")
    try:
        api_client.stop_upload_inference_data(device_id=device_id)
        base64_image = api_client.get_direct_image(device_id=device_id)
        if base64_image is None:
            logger.warning(f"Image retrieval failed for device: {device_id}")
            raise HTTPException(status_code=500, detail="Couldn't retrieve image")
        logger.info(f"Successfully retrieved image for device: {device_id}")
        return base64_image
    except Exception as e:
        logger.error(
            f"Error while retrieving image for device {device_id}: {e}", exc_info=True
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start_processing/{device_id}", response_model=StatusResponse)
async def start_processing(
    device_id: str,
    data_pipeline: InjectDataPipeline,
    receive_image: bool = Query(False),
    solution_type: SolutionType = Query(SolutionType.people_count),
    api_client: ClientInferface = Depends(get_api_client),
) -> StatusResponse:
    """This endpoint starts the data processing for a specific device,
       as well as the data collection.

    Args:
        device_id (str): Device ID
        receive_image (bool): Whether or not to receive image data
        solution_type (SolutionType): The type of solution to process

    Returns:
        StatusResponse: Status of the operation
    """
    logger.debug(f"Received request to start processing for device: {device_id}")
    try:
        api_client.stop_upload_inference_data(device_id=device_id)

        response = api_client.start_upload_inference_data(
            device_id=device_id, get_image=receive_image
        )
        if not active_data_pipeline.is_set() or not data_pipeline.is_active(device_id):
            logger.info(f"Starting data collection for device: {device_id}")
            data_pipeline.start_data_collection(
                device_id=device_id,
                solution_type=solution_type,
                get_image=receive_image,
            )
            if not active_data_pipeline.is_set():
                active_data_pipeline.set()

        logger.info(f"Data processing started for device: {device_id}")
        return response

    except Exception as e:
        logger.error(
            f"Error while starting processing for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stop_processing/{device_id}", response_model=StatusResponse)
async def stop_processing(
    device_id: str,
    data_pipeline: InjectDataPipeline,
    api_client: ClientInferface = Depends(get_api_client),
) -> StatusResponse:
    """This endpoint stops the data processing for a specific device, as well as the data collection.

    Args:
        device_id (str): Device ID

    Returns:
        StatusResponse: Status of the operation
    """
    logger.debug(f"Received request to stop processing for device: {device_id}")
    try:
        if active_data_pipeline.is_set():
            logger.info(f"Stopping data collection for device: {device_id}")
            data_pipeline.stop_data_collection(device_id)
            if not data_pipeline.is_active():
                active_data_pipeline.clear()
        logger.info(f"Data processing stopped for device: {device_id}")
        return api_client.stop_upload_inference_data(device_id=device_id)
    except Exception as e:
        logger.error(
            f"Error while stopping processing for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, data_pipeline: InjectDataPipeline):
    """This endpoint handles the WebSocket connection for real-time data streaming."""
    logger.debug("WebSocket connection initiated")
    await websocket.accept()
    websocket_closed = False

    try:
        await active_data_pipeline.wait()

        logger.info("WebSocket data streaming started")
        while active_data_pipeline.is_set():
            data = data_pipeline.get_data()
            if data:
                image, inference, timestamp, device_id = data
                data_to_send = {
                    "image": image,
                    "inference": inference,
                    "timestamp": timestamp,
                    "deviceId": device_id,
                }
                await websocket.send_json(data_to_send)
            await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
        websocket_closed = True

    except Exception as e:
        logger.error(f"Unexpected error in WebSocket connection: {e}")

    finally:
        if not websocket_closed:
            logger.debug("Closing WebSocket connection")
            await websocket.close()
