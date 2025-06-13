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
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ConnectionState(str, Enum):
    connected = "Connected"
    disconnected = "Disconnected"


class InferenceState(str, Enum):
    streaming = "Streaming"
    standby = "Standby"
    idle = "Idle"


class Device(BaseModel):
    device_id: str
    device_name: str
    connection_state: ConnectionState
    models: Optional[list[str]] = None
    application: Optional[list[str]] = None
    inference_status: Optional[InferenceState] = None


class Devices(BaseModel):
    devices: list[Device]
