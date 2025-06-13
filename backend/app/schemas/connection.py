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
from pydantic import BaseModel
from pydantic import Field


class ConsoleSettings(BaseModel):
    console_endpoint: str = Field(
        ...,
        description="URL of the console endpoint. Example: `https://example.com`",
    )
    portal_authorization_endpoint: str = Field(
        ...,
        description="URL for the portal authorization endpoint. Example: `https://auth.example.com`",
    )
    client_id: str = Field(
        ...,
        description="Identifier for the client accessing the console. Example: `test_client_id`",
    )
    client_secret: str = Field(
        ...,
        description="Secret key associated with the client. Example: `test_client_secret`",
    )
