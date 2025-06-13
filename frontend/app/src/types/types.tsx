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

export type StatusResponse = {
  status: string;
};

export type SelectedRegionId = string | null;
export type Point = {
  x: number;
  y: number;
};
export type Region = {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type BoundingBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
export type GeneralObject = {
  class_id: number;
  bounding_box: BoundingBox;
  score: number;
};
export type ObjectDetectionData = {
  object_detection_list: GeneralObject[];
};
export type ObjectDetectionTop = {
  perception: ObjectDetectionData;
};

export type PeopleCountInference = ObjectDetectionTop & {
  people_count: number;
};
export type PeopleCountInRegionsInference = ObjectDetectionTop & {
  people_count_in_regions: { [region_id: string]: number };
};
export type HeatmapInference = ObjectDetectionTop & {
  heatmap: number[][];
};
export type Inference =
  | ObjectDetectionTop
  | PeopleCountInference
  | PeopleCountInRegionsInference
  | HeatmapInference;

export function isPeopleCountInference(
  obj: unknown,
): obj is PeopleCountInference {
  return obj != null && typeof obj === "object" && "people_count" in obj;
}

export function isPeopleCountInRegionsInference(
  obj: unknown,
): obj is PeopleCountInRegionsInference {
  return (
    obj != null && typeof obj === "object" && "people_count_in_regions" in obj
  );
}

export function isHeatmapInference(obj: unknown): obj is HeatmapInference {
  return obj != null && typeof obj === "object" && "heatmap" in obj;
}

// REALTIME MODE
export type PeopleCountTelemetry = {
  timestamp: string;
  people_count: number | null;
};
export type PeopleCountInRegionsTelemetry = {
  timestamp: string;
  people_count_in_regions: { [region_id: string]: number };
};

// HISTORY MODE
export type ImageAndInferenceWithTimestamp = {
  image: string;
  inference: Inference;
  timestamp: string;
};
export type InferenceWithTimestamp = {
  inference: Inference;
  timestamp: string;
};
export type HistoryImagesAndInferences = {
  data: ImageAndInferenceWithTimestamp[];
};
export type HistoryInferences = {
  data: InferenceWithTimestamp[];
};
export type HistoryData = HistoryInferences | HistoryImagesAndInferences;

export function hasImage(obj: unknown): obj is { image: string } {
  return obj != null && typeof obj === "object" && "image" in obj;
}
