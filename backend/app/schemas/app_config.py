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


class Region(BaseModel):
    id: str = Field(..., description="Region's unique id.")
    left: int = Field(..., description="Region's left coordinate")
    top: int = Field(..., description="Region's top coordinate")
    right: int = Field(..., description="Region's right coordinate")
    bottom: int = Field(..., description="Region's bottom coordinate")


class RegionsSettings(BaseModel):
    regions: list[Region] = Field(
        ..., description="List of regions for people counting in regions"
    )


class PeopleCountSettings(BaseModel):
    bbox_to_point_ratio: float = Field(
        ..., description="Bounding box to point ratio for people counting"
    )


class PeopleCountInRegionSettings(BaseModel):
    bbox_to_point_ratio: float = Field(
        ..., description="Bounding box to point ratio for people counting in regions"
    )
    regions: list[Region] = Field(
        ..., description="List of regions for people counting in regions"
    )


class HeatmapSettings(BaseModel):
    bbox_to_point_ratio: float = Field(
        ..., description="Bounding box to point ratio for heatmap generation"
    )
    last_valid_frame: int = Field(
        ..., description="Last valid frame number for heatmap"
    )
    image_size_w: int = Field(..., description="Width of the image for heatmap")
    image_size_h: int = Field(..., description="Height of the image for heatmap")
    grid_num_w: int = Field(..., description="Number of grids in width for heatmap")
    grid_num_h: int = Field(..., description="Number of grids in height for heatmap")


class AppConfig(BaseModel):
    people_count_settings: PeopleCountSettings = Field(
        ..., description="Settings for people counting"
    )
    people_count_in_regions_settings: PeopleCountInRegionSettings = Field(
        ..., description="Settings for people counting in regions"
    )
    heatmap_settings: HeatmapSettings = Field(..., description="Settings for heatmap")
