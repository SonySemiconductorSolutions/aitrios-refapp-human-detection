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

from app.config.app_config import load_app_config_from_yaml
from app.config.app_config import update_regions_in_app_config
from app.schemas.app_config import AppConfig
from app.schemas.app_config import RegionsSettings
from app.schemas.common import StatusResponse
from fastapi import APIRouter
from fastapi import HTTPException

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/app_config", tags=["AppConfig"])


@router.patch("/regions", response_model=StatusResponse)
async def patch_app_confing_regions(
    regions_settings: RegionsSettings,
) -> StatusResponse:
    """
    Update the regions settings and persist them to the configuration YAML file.
    \f
    Args:
        settings (RegionsSettings): The regions settings provided in the request body.

    Returns:
        StatusResponse: Status response.
    """
    logger.info("Received request to update app config")
    try:
        update_regions_in_app_config(regions_settings.model_dump())
        logger.debug("Successfully updated and saved regions settings")
        return StatusResponse(status="success")
    except Exception as e:
        logger.error(f"Failed to set regions settings - {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get(
    "/",
    response_model=AppConfig,
)
async def get_app_config() -> AppConfig:
    """
    Retrieve the app config for PeopleCount, PeopleCountInRegions, and Heatmap from the configuration YAML file.
    \f
    Returns:
        AppConfig: The app config as stored in the YAML file.
    """
    logger.info("Received request to retrieve app config")
    try:
        settings = load_app_config_from_yaml()
        if not settings:
            logger.warning("App Config not found in YAML file")
            raise HTTPException(status_code=404, detail="App Config not found.")

        logger.debug("Successfully retrieved app config from YAML file")
        return settings
    except Exception as e:
        logger.error(f"Error retrieving app config - {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
