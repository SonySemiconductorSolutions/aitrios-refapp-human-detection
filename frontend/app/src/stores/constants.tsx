/**
 * Copyright 2025 Sony Semiconductor Solutions Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, Region, SelectedRegionId } from "../types/types";
import { ConfigurationV1 } from "../utils/EdgeAppConfigurationFromConsole";

export const canvasMaxWidth: number = 320;
export const canvasMaxHeight: number = 320;

export const defaultInputWidth: number = 320;
export const defaultInputHeight: number = 320;

export const defaultMaxDetections: number = 5;
export const defaultDnnOutputDetections: number = 50;

export const defaultImageSrc: string = "";
export const defaultModelId: string = "";

/**
 * Defines the available regions in the application.
 * This array controls:
 * 1. The number and IDs of region buttons displayed in the UI
 * 2. The regions that can be selected and manipulated by users
 *
 * Important notes:
 * - This is a frontend-only configuration that does not depend on backend data
 * - These values are static and will not be updated from API responses
 * - Any changes must be made directly in this code
 *
 * Example: Using ["region1", "region2", "region3"] will create 3 selectable regions
 * with corresponding UI buttons.
 */
export const defaultEnableRegionIds: string[] = ["region1", "region2"];
export const defaultSelectedRegionId: SelectedRegionId = null;
export const defaultStartPoint: Point = { x: 0, y: 0 };
export const defaultEndPoint: Point = { x: 0, y: 0 };

export const minDetectionThreshold: number = 0.0;
export const defaultDetectionThreshold: number = 0.5;
export const maxDetectionThreshold: number = 1.0;
export const stepDetectionThreshold: number = 0.005;

export const minTimeBetweenUploads: number = 0.1; // 0.1 seconds
export const defaultTimeBetweenUploads: number = 1;
export const maxTimeBetweenUploads: number = 600; // 10 minutes
export const stepUploadInterval: number = 1; // 1 second

export const defaultSendImageFlag: boolean = true;

export const defaultConfiguration: ConfigurationV1 = {
  file_name: "none",
  commands: [],
};

// Default regions for RegionContext based on app_config.yaml
export const defaultRegions: Region[] = [
  {
    id: "region1",
    left: 0,
    top: 0,
    right: 150,
    bottom: 320,
  },
  {
    id: "region2",
    left: 170,
    top: 0,
    right: 320,
    bottom: 320,
  },
];

// Default values for AppConfigContext based on app_config.yaml
export const defaultPeopleCountBboxToPointRatio: number = 0.9;
export const defaultPeopleCountInRegionsBboxToPointRatio: number = 0.9;
export const defaultHeatmapBboxToPointRatio: number = 0.9;
export const defaultHeatmapLastValidFrame: number = 600;
export const defaultHeatmapImageSizeW: number = 320;
export const defaultHeatmapImageSizeH: number = 320;
export const defaultHeatmapGridNumW: number = 8;
export const defaultHeatmapGridNumH: number = 8;
