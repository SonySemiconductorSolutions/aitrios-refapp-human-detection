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
from typing import Annotated

from app.client.client_factory import get_api_client
from app.client.client_interface import ClientInferface
from app.schemas.device import Device
from app.schemas.device import Devices
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Path

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/devices", tags=["Devices"])


@router.get("/", response_model=Devices)
async def get_devices(api_client: ClientInferface = Depends(get_api_client)) -> Devices:
    """
    Get the list of devices.

    This endpoint retrieves the list of available devices through the console access API.
    Returns:
        Devices: Pydantic model containing a list of Device instances.
    """
    logger.info("Received request to retrieve the list of devices")
    try:
        devices = api_client.get_devices()
        logger.debug("Successfully retrieved devices: %s", devices)
        return devices
    except Exception as e:
        logger.error("Error retrieving devices: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{device_id}", response_model=Device)
async def get_device(
    device_id: Annotated[
        str, Path(description="The ID of the device to retrieve information for")
    ],
    api_client: ClientInferface = Depends(get_api_client),
) -> Device:
    """
    Retrieve specific device information.

    Args:
        device_id (str): The ID of the device to retrieve models for.

    Returns:
        Device: Device information (id, connection state, models and applications)
    """
    logger.info("Received request to retrieve information for device ID: %s", device_id)
    try:
        device = api_client.get_device(device_id)
        logger.debug("Successfully retrieved device information: %s", device)
        return device
    except Exception as e:
        logger.error(
            "Error retrieving device information for ID %s: %s",
            device_id,
            e,
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))
