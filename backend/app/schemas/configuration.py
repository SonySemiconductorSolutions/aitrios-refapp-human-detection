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
from typing import Optional

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class Configuration(BaseModel): ...


class ParametersV1(BaseModel):
    Mode: int = Field(ge=0, le=2)
    UploadMethod: Optional[str] = None
    FileFormat: Optional[str] = None
    UploadMethodIR: Optional[str] = None
    NumberOfImages: Optional[int] = Field(None, ge=0, le=10000)
    UploadInterval: Optional[int] = Field(None, ge=1, le=2592000)
    MaxDetectionsPerFrame: Optional[int] = Field(None, ge=1, le=5)
    ModelId: Optional[str] = None
    PPLParameter: Optional[object] = None


class CommandV1(BaseModel):
    command_name: str
    parameters: ParametersV1


class ConfigurationV1(Configuration):
    file_name: str
    commands: list[CommandV1]


class ParametersV2(BaseModel):
    Mode: int = Field(ge=0, le=2)
    UploadInterval: Optional[int] = Field(None, ge=1, le=2592000)
    PPLParameter: dict


class CommandV2(BaseModel):
    command_name: str = ""
    parameters: ParametersV2


class ResInfoData(BaseModel):
    model_config = ConfigDict(extra="allow")
    res_id: str


class InferenceSettingsData(BaseModel):
    number_of_iterations: int


class MetadataData(BaseModel):
    path: str
    method: int
    enabled: bool
    endpoint: str
    storage_name: str


class InputTensorData(BaseModel):
    path: str
    method: int
    enabled: bool
    endpoint: str
    storage_name: str


class PortSettingsData(BaseModel):
    metadata: MetadataData
    input_tensor: InputTensorData


class CodecSettingsData(BaseModel):
    format: int


class CommonSettingsData(BaseModel):
    process_state: int
    log_level: int
    inference_settings: InferenceSettingsData
    pq_settings: None | dict = None
    port_settings: PortSettingsData
    codec_settings: CodecSettingsData
    number_of_inference_per_message: int


class MetadataSettingsData(BaseModel):
    format: int


class CustomSettingsData(BaseModel):
    ai_models: None | dict = None
    area: None | dict = None
    metadata_settings: None | MetadataSettingsData = None
    res_info: None | ResInfoData = None


class EdgeAppInfo(BaseModel):
    res_info: None | ResInfoData = None
    common_settings: None | CommonSettingsData = None
    custom_settings: None | CustomSettingsData = None


class ConfigurationV2(Configuration):
    edge_app: EdgeAppInfo


DeviceConfiguration = ConfigurationV1 | ConfigurationV2
