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

import { useScreenContext } from "../../../../stores/ScreenContext";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";
import { updateEdgeAppConfigurationIfRequired } from "../../../../utils/EdgeAppConfigurationUpdate";
import {
  startProcessing,
  stopProcessing,
} from "../../../../utils/ProcessingService";
import { useUpdateEdgeAppConfigurationState } from "../../../../hooks/EdgeAppConfigurationUpdateHook";
import { useAppContext } from "../../../../stores/AppContext";

export function useInferenceControl() {
  const { solutionType } = useAppContext();
  const { setScreenStage } = useScreenContext();
  const { deviceId } = useDeviceModelIdContext();
  const { sendImageFlag } = useEdgeAppConfigurationContext();
  const commandParamState = useUpdateEdgeAppConfigurationState();

  const StartInference = async () => {
    if (!deviceId) {
      console.error("Device ID is not available.");
      return;
    }

    setScreenStage("inference_starting");
    try {
      await updateEdgeAppConfigurationIfRequired(deviceId, commandParamState);
      const response = await startProcessing(
        deviceId,
        sendImageFlag,
        solutionType,
      );
      console.log("Start Processing Response:", response);
      setScreenStage("inference_running");
    } catch (error) {
      setScreenStage("parameter_selection");
      throw error;
    }
  };

  const StopInference = async () => {
    if (!deviceId) {
      console.error("Device ID is not available.");
      return;
    }

    setScreenStage("inference_stopping");
    try {
      const response = await stopProcessing(deviceId);
      console.log("Stop Processing Response:", response);
      setScreenStage("parameter_selection");
    } catch (error) {
      setScreenStage("inference_running");
      throw error;
    }
  };

  return { StartInference, StopInference };
}
