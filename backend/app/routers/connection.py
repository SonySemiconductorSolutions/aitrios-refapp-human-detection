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
from app.config.get_console_settings import load_settings_from_yaml
from app.config.get_console_settings import save_settings_to_yaml
from app.schemas.common import StatusResponse
from app.schemas.connection import ConsoleSettings
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/connection", tags=["Connection"])


@router.put("/", response_model=StatusResponse)
async def set_console_settings(
    settings: ConsoleSettings, api_client: ClientInferface = Depends(get_api_client)
) -> StatusResponse:
    """
    Update the console settings and persist them to the configuration YAML file.
    \f
    Args:
        settings (ConsoleSettings): The console settings provided in the request body.

    Returns:
        StatusResponse: Status response.
    """
    logger.info("Received request to update console settings")
    try:
        save_settings_to_yaml(settings.model_dump())
        api_client.reload_client()
        logger.debug("Successfully updated and saved console settings")
        return StatusResponse(status="success")
    except Exception as e:
        logger.error(f"Failed to set console settings - {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get(
    "/",
    response_model=ConsoleSettings,
)
async def get_console_settings() -> ConsoleSettings:
    """
    Retrieve the console settings from the configuration YAML file.
    \f
    Returns:
        ConsoleSettings: The current console settings as stored in the YAML file.
    """
    logger.info("Received request to retrieve console settings")
    try:
        settings = load_settings_from_yaml()
        if not settings:
            logger.warning("Console settings not found in YAML file")
            raise HTTPException(status_code=404, detail="Settings not found.")

        logger.debug("Successfully retrieved console settings from YAML file")
        return settings
    except Exception as e:
        logger.error(f"Error retrieving console settings - {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
