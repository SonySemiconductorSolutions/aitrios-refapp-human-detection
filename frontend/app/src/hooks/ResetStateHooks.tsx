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

import { useAppContext } from "../stores/AppContext";
import { useHistoryDataContext } from "../stores/HistoryDataContext";
import { useImageInferenceContext } from "../stores/ImageInferenceContext";
import { ScreenStage } from "../stores/ScreenContext";
import { stopProcessing } from "../utils/ProcessingService";

export async function stopDeviceProcessing(
  deviceId: string,
  setScreenStage: (stage: ScreenStage) => void,
) {
  if (!deviceId) {
    console.error("Device ID is not available.");
    return false;
  }
  try {
    const response = await stopProcessing(deviceId);
    console.log("Stop Processing Response:", response);
    setScreenStage("inference_stopping");
    return true;
  } catch (error) {
    console.error("Error stopping processing:", error);
    return false;
  }
}

export function useResetRealtimeMode() {
  const { setSocketActive } = useAppContext();
  const {
    setDataStreamActive,
    setImageSrc,
    setInferenceTS,
    setInferenceData,
    setPeopleCountTelemetries,
    setPeopleCountInRegionsTelemetries,
  } = useImageInferenceContext();

  const resetStateRealtimeMode = () => {
    setSocketActive(false);
    setDataStreamActive(false);
    setImageSrc("");
    setInferenceTS("");
    setInferenceData({ perception: { object_detection_list: [] } });
    setPeopleCountTelemetries([]);
    setPeopleCountInRegionsTelemetries([]);
    console.log("Resetting state for Realtime mode");
  };

  return { resetStateRealtimeMode };
}

export function useResetHistoryMode() {
  const { setIsPlaybackActive, setHistoryData } = useHistoryDataContext();

  const resetStateHistoryMode = () => {
    setIsPlaybackActive(false);
    setHistoryData({ data: [] });
    console.log("Resetting state for History mode");
  };

  return { resetStateHistoryMode };
}
