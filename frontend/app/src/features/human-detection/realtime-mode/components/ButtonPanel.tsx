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
import {
  useScreenContext,
  isConfigurationStages,
} from "../../../../stores/ScreenContext";
import { useImageInferenceContext } from "../../../../stores/ImageInferenceContext";
import { useInferenceControl } from "../hooks/useInferenceControl";
import { useAppContext } from "../../../../stores/AppContext";

export function buttonTextFromStage(screenStage: string): string {
  let buttonText: string = "Start Inference";
  if (screenStage === "inference_running") {
    buttonText = "Stop Inference";
  } else if (screenStage === "inference_starting") {
    buttonText = "Starting Inference ...";
  } else if (screenStage === "inference_stopping") {
    buttonText = "Stopping Inference ...";
  }
  return buttonText;
}

export function ButtonPanel() {
  const { setSocketActive } = useAppContext();
  const { screenStage } = useScreenContext();
  const { setDataStreamActive } = useImageInferenceContext();
  const { StartInference, StopInference } = useInferenceControl();

  const handleStartInference = async () => {
    try {
      await StartInference();
      setDataStreamActive(true);
      setSocketActive(true);
    } catch (error) {
      console.error("Error starting processing:", error);
    }
  };

  const handleStopInference = async () => {
    try {
      await StopInference();
      setDataStreamActive(false);
      setSocketActive(false);
    } catch (error) {
      console.error("Error stopping processing:", error);
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Button
        variant="contained"
        onClick={
          screenStage === "inference_running" ||
          screenStage === "inference_starting"
            ? handleStopInference
            : handleStartInference
        }
        disabled={
          !isConfigurationStages(screenStage) &&
          screenStage != "inference_running"
        }
        style={{ width: "100%" }}
        children={buttonTextFromStage(screenStage)}
      />
    </Card>
  );
}
