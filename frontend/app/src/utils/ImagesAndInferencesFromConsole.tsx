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

import { SolutionType, ConsoleType } from "../stores/AppContext";
import { HistoryInferences, HistoryImagesAndInferences } from "../types/types";

/*
Calls backend to retrieve the list of image directories linked with device.
*/
export async function getImageDirectories(deviceId: string): Promise<string[]> {
  const url =
    import.meta.env.VITE_BACKEND_URL + "insight/directories/" + deviceId;
  console.log("deviceId: " + deviceId + ", url: " + url);
  const response = await fetch(url);
  let directories = [];
  if (deviceId) {
    try {
      const json = await response.json();
      directories = json["directories"];
    } catch {
      console.log("Error fetching device data");
    }
  } else {
    console.log("deviceId not set");
  }

  console.log("Device directories: ", directories);

  return directories;
}

/*
Calls backend to retrieve the list of Inference and Image linked with selected directory.
*/
export async function fetchImagesAndInferences(
  deviceId: string,
  sub_directory_name: string,
  solutionType: SolutionType,
  consoleType: ConsoleType,
): Promise<HistoryImagesAndInferences> {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL +
    `insight/images_and_inferences/${deviceId}/${sub_directory_name}?solution_type=${solutionType}`;
  console.log("API Call: ", backendUrl);

  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch images and inferences");
    }

    const json: HistoryImagesAndInferences = await response.json();

    // sas_url
    if (consoleType == "ONLINE V2") {
      return json;
    }
    // base64
    if (consoleType == "ONLINE V1") {
      const processedData = json.data.map((snapshot) => {
        const base64Image = snapshot.image;
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        return {
          ...snapshot,
          image: imageSrc,
        };
      });
      return { data: processedData };
    } else {
      throw new Error("Invalid console type");
    }
  } catch (error) {
    console.error("Error fetching images and inferences:", error);
    throw error;
  }
}

/*
Calls backend to retrieve the list of Inference in selected time zone linked with device.
*/
export async function fetchInferences(
  deviceId: string,
  fromDatetime: string,
  toDatetime: string,
  solutionType: SolutionType,
): Promise<HistoryInferences> {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL +
    `insight/inferences/${deviceId}?from_datetime=${fromDatetime}&to_datetime=${toDatetime}&solution_type=${solutionType}`;
  console.log("API Call: ", backendUrl);

  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch inferences");
    }

    const data: HistoryInferences = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inferences:", error);
    throw error;
  }
}
