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
import base64
import logging

import requests
from fastapi import HTTPException

logger = logging.getLogger(__name__)


def get_token(
    client_id: str, client_secret: str, portal_authorization_endpoint: str
) -> tuple[dict, int]:
    """Get Online Console Access Token

    Args:
        client_id (str): Client id
        client_secret (str): Client secret
        portal_authorization_endpoint (str): Portal authorization endpoint

    Returns:
        dict: Access token
    """
    logger.debug("Fetching access token from the portal.")
    plane_str = f"{client_id}:{client_secret}"
    encoded_str = base64.b64encode(plane_str.encode("utf-8")).decode("utf-8")
    authorization_code = f"Basic {encoded_str}"
    headers = {
        "accept": "application/json",
        "authorization": authorization_code,
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "client_credentials",
        "scope": "system",
    }

    try:
        logger.info("Making POST request to the portal authorization endpoint.")
        response = requests.post(
            url=portal_authorization_endpoint,
            headers=headers,
            data=data,
        )
        response.raise_for_status()
        analysis_info = response.json()

        if "error" in analysis_info:
            logger.error(f"Token error: {analysis_info['error']}")
            raise HTTPException(
                status_code=401, detail=f"Token error: {analysis_info['error']}"
            )

        if "access_token" not in analysis_info:
            logger.error("Access token not found in response.")
            raise HTTPException(
                status_code=401, detail="Access token not found in response."
            )

        return analysis_info["access_token"], analysis_info["expires_in"]
    except requests.exceptions.RequestException as error:
        logger.error(f"Failed to retrieve access token: {str(error)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve access token: {str(error)}"
        )
