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
import os

from app.client.client_factory import is_allowed_client_type
from app.routers.dependencies import InjectDataPipeline
from app.schemas.common import StatusResponse
from fastapi import APIRouter
from fastapi import HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class ClientTypeRequest(BaseModel):
    client_type: str


router = APIRouter(prefix="/client", tags=["Client"])


@router.put("/", response_model=StatusResponse)
async def set_client_type(
    client_type_request: ClientTypeRequest, data_pipeline: InjectDataPipeline
) -> StatusResponse:
    """
    Update the choice of the device management client and persist it in an environmental variable.
    \f
    Args:
        client_type (ClientTypeRequest): The name of the device management client provided in the request body.

    Returns:
        StatusResponse: Status response.
    """
    logger.info(f"Updating client type to {client_type_request.client_type}")
    client_type = client_type_request.client_type
    if not is_allowed_client_type(client_type):
        logger.error(f"Unknown client type: {client_type}")
        raise HTTPException(
            status_code=404, detail=f"Unknown client type: {client_type}"
        )
    if os.environ.get("CLIENT_TYPE", None) != client_type:
        data_pipeline.reset_client()
    os.environ["CLIENT_TYPE"] = client_type
    return StatusResponse(status="success")


@router.get("/", response_model=str)
async def get_client_type() -> str:
    """
    Retrieve the selected device management client provided from the environmental variable.
    \f
    Returns:
        str: The name of the currently selected device management client provided as stored in the environmental variable.
    """
    client_type = os.getenv("CLIENT_TYPE")
    if not client_type:
        logger.error("No device management client selected.")
        raise HTTPException(
            status_code=404, detail="No device management client selected."
        )
    return client_type
