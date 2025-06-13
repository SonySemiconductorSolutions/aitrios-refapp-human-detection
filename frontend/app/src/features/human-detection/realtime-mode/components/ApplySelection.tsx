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

import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import {
  isInferenceStages,
  isInitialStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";
import { getInitialValuesFromConfiguration } from "../../../../utils/EdgeAppConfigurationFromConsole";
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";
import { useImageInferenceContext } from "../../../../stores/ImageInferenceContext";
import { useAppContext } from "../../../../stores/AppContext";
import { fetchImage } from "../../../../utils/GetImageFromConsole";
import {
  canvasMaxHeight,
  canvasMaxWidth,
  defaultConfiguration,
  defaultDetectionThreshold,
  defaultSendImageFlag,
  defaultTimeBetweenUploads,
} from "../../../../stores/constants";

export function ApplySelection() {
  const { deviceId, modelId } = useDeviceModelIdContext();
  const { screenStage, setScreenStage, setCanvasWidth, setCanvasHeight } =
    useScreenContext();
  const {
    setDetectionThreshold,
    setUploadInterval,
    setSendImageFlag,
    setConfiguration,
  } = useEdgeAppConfigurationContext();
  const {
    setImageSrc,
    setInferenceTS,
    setInferenceData,
    setPeopleCountTelemetries,
    setPeopleCountInRegionsTelemetries,
  } = useImageInferenceContext();
  const { consoleType } = useAppContext();
  const { setSocketActive } = useAppContext();
  const oldDeviceId = useRef(deviceId);

  function setInitialState(deviceId: string): void {
    setSocketActive(false);
    Promise.all([
      getInitialValuesFromConfiguration(deviceId, consoleType, modelId),
      fetchImage(deviceId),
    ])
      .then(([configResult, imageResult]) => {
        const [initialState, configuration, isDefaultConfig] = configResult;

        setDetectionThreshold(initialState.detectionThreshold);
        setUploadInterval(initialState.uploadInterval);
        setSendImageFlag(initialState.sendImageFlag);
        setConfiguration(configuration);
        setCanvasWidth(initialState.inputWidth);
        setCanvasHeight(initialState.inputHeight);

        const imageSrc = `data:image/jpeg;base64,${imageResult.replace(/"/g, "")}`;
        setImageSrc(imageSrc);
        setInferenceData({ perception: { object_detection_list: [] } });

        if (isDefaultConfig) {
          setScreenStage("extra_parameter_selection");
        } else {
          setScreenStage("parameter_selection");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching image or configuration." + err);
        setScreenStage("apply_ready");
      });
  }

  useEffect(() => {
    if (deviceId === "" || oldDeviceId.current != deviceId) {
      // no device ID provided or changed device ID
      setDetectionThreshold(defaultDetectionThreshold);
      setConfiguration(defaultConfiguration);
      setCanvasWidth(canvasMaxWidth);
      setCanvasHeight(canvasMaxHeight);
      setUploadInterval(defaultTimeBetweenUploads);
      setSendImageFlag(defaultSendImageFlag);
      setImageSrc("");
      setInferenceTS("");
      setInferenceData({ perception: { object_detection_list: [] } });
      setPeopleCountTelemetries([]);
      setPeopleCountInRegionsTelemetries([]);
      console.log("Resetting configuration values and imageSrc");
    }
    oldDeviceId.current = deviceId;
  }, [deviceId]);

  return isInitialStages(screenStage) ? (
    <Button
      variant="contained"
      onClick={() => {
        setScreenStage("parameter_loading");
        setInitialState(deviceId);
      }}
      disabled={modelId === ""}
      sx={{ width: "90%" }}
    >
      Apply
    </Button>
  ) : (
    <Button
      variant="contained"
      onClick={() => {
        setScreenStage("apply_ready");
      }}
      disabled={
        isInferenceStages(screenStage) && !(screenStage == "inference_running")
      }
      sx={{ width: "90%" }}
    >
      Configure
    </Button>
  );
}
