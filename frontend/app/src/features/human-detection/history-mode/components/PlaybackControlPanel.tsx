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

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import { useScreenContext } from "../../../../stores/ScreenContext";
import { useAppContext } from "../../../../stores/AppContext";
import {
  fetchImagesAndInferences,
  fetchInferences,
} from "../../../../utils/ImagesAndInferencesFromConsole";
import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";
import { useHistoryDataContext } from "../../../../stores/HistoryDataContext";
import { useDeviceDataTimeRangeContext } from "../../../../stores/DeviceDataTimeRangeContext";

function buttonTextFromStage(screenStage: string): string {
  let buttonText: string = "Start Playback";
  if (screenStage === "inference_running") {
    buttonText = "End Playback";
  } else if (screenStage === "inference_starting") {
    buttonText = "Starting Playback ...";
  } else if (screenStage === "inference_stopping") {
    buttonText = "Ending Playback ...";
  }
  return buttonText;
}

export default function PlaybackControlPanel() {
  const { solutionType, consoleType } = useAppContext();
  const { screenStage, setScreenStage } = useScreenContext();
  const { deviceId } = useDeviceModelIdContext();
  const { selectedImageDirectory } = useDeviceDirectoryContext();
  const { setIsPlaybackActive, setHistoryData } = useHistoryDataContext();
  const { startDateTime, endDateTime } = useDeviceDataTimeRangeContext();
  const { fetchImageFlag } = useHistoryDataContext();
  const { isDateTimeRangeValid } = useDeviceDataTimeRangeContext();

  const handleStartPlayback = async () => {
    try {
      setScreenStage("inference_starting");
      if (fetchImageFlag) {
        const result = await fetchImagesAndInferences(
          deviceId,
          selectedImageDirectory,
          solutionType,
          consoleType,
        );
        setHistoryData(result);
      } else {
        console.log("startDateTime", startDateTime.toISOString());
        const result = await fetchInferences(
          deviceId,
          startDateTime.toISOString(),
          endDateTime.toISOString(),
          solutionType,
        );
        setHistoryData(result);
      }
      setIsPlaybackActive(true);
      console.log("Start Playback");
      setScreenStage("inference_running");
    } catch (error) {
      console.error("Error starting processing:", error);
      setScreenStage("parameter_selection");
    }
  };

  const handleEndPlayback = () => {
    setScreenStage("inference_stopping");
    if (!deviceId) {
      console.error("Device ID is not available.");
      return;
    }
    setIsPlaybackActive(false);
    console.log("End Playback");
    setScreenStage("parameter_selection");
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Button
        variant="contained"
        onClick={
          screenStage === "inference_running" ||
          screenStage === "inference_starting"
            ? handleEndPlayback
            : handleStartPlayback
        }
        disabled={
          !(
            screenStage === "parameter_selection" &&
            (fetchImageFlag ? selectedImageDirectory : isDateTimeRangeValid)
          ) && screenStage != "inference_running"
        }
        style={{ width: "100%" }}
        children={buttonTextFromStage(screenStage)}
      />
    </Card>
  );
}
