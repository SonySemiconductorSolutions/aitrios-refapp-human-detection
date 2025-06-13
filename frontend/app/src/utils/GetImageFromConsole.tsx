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

export async function fetchImage(deviceId: string): Promise<string> {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL + `processing/image/${deviceId}`;
  console.log("API Call: ", backendUrl);
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const base64Image = await response.text();
    return base64Image;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}
