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

from app.client.client_factory import get_api_client
from app.client.client_interface import ClientInferface
from app.schemas.common import StatusResponse
from app.schemas.configuration import DeviceConfiguration
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/configurations", tags=["Configurations"])


@router.get("/{device_id}", response_model=DeviceConfiguration)
async def get_configuration_file(
    device_id: str, api_client: ClientInferface = Depends(get_api_client)
) -> DeviceConfiguration:
    """
    Retrieve the configuration file for a specific device.

    Args:
        device_id (str): ID of the device.

    Returns:
        DeviceConfiguration: The configuration file.
    """
    logger.info(f"Retrieving configuration file for device_id: {device_id}")
    try:
        return api_client.get_configuration(device_id=device_id)
    except Exception as e:
        logger.error(
            f"Error retrieving configuration for device_id: {device_id} - {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{device_id}", response_model=StatusResponse)
async def put_configuration(
    device_id: str,
    configuration: DeviceConfiguration,
    api_client: ClientInferface = Depends(get_api_client),
) -> StatusResponse:
    """
    Apply the configuration to the device, potentially replacing an existing one.

    Args:
        device_id (str): ID of the device.
        configuration (DeviceConfiguration): The configuration to be used on the device.

    Returns:
        StatusResponse: Status message.
    """
    logger.info(f"Replacing configuration in device_id: {device_id}")
    try:
        return await api_client.set_configuration(
            device_id=device_id, configuration=configuration
        )
    except Exception as e:
        logger.error(
            f"Error replacing configuration in device_id: {device_id} - {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{device_id}", response_model=StatusResponse)
async def update_configuration(
    device_id: str,
    configuration: DeviceConfiguration,
    api_client: ClientInferface = Depends(get_api_client),
) -> StatusResponse:
    """
    Updates the configuration on the device, replacing only some of its values.

    Args:
        file_name (str): Name of the configuration file.
        configuration (DeviceConfiguration): A DeviceConfiguration object with the values to update in the device configuration.

    Returns:
        StatusResponse: Status message.
    """
    logger.info(f"Updating configuration for device_id: {device_id}")
    try:
        return await api_client.update_configuration(
            device_id=device_id, configuration=configuration
        )
    except Exception as e:
        logger.error(
            f"Error updating configuration for device_id: {device_id} - {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))
