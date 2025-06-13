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
import os
from typing import Optional

from app.client.client_interface import ClientInferface
from app.client.online_client_v1 import OnlineConsoleClientV1
from app.client.online_client_v2 import OnlineConsoleClientV2

# Singleton instances
_singleton_clients: dict[str, Optional[ClientInferface]] = {
    "ONLINE V1": None,
    "ONLINE V2": None,
}


def is_allowed_client_type(client_type: str) -> bool:
    return client_type in _singleton_clients


def get_api_client() -> ClientInferface:
    """
    Factory function to get or create a singleton instance of the appropriate client.

    Returns:
        ClientInterface: A singleton instance of the appropriate client.
    """
    client_type = os.getenv("CLIENT_TYPE")
    if not is_allowed_client_type(client_type):
        raise ValueError(f"Unknown client type: {client_type}")

    # Check if the client already exists
    if _singleton_clients[client_type] is None:
        if client_type == "ONLINE V1":
            _singleton_clients[client_type] = OnlineConsoleClientV1()
        elif client_type == "ONLINE V2":
            _singleton_clients[client_type] = OnlineConsoleClientV2()

    return _singleton_clients[client_type]
