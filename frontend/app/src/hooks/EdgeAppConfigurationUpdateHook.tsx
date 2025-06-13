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

import { useDeviceModelIdContext } from "../stores/DeviceModelIdContext";

import { useScreenContext } from "../stores/ScreenContext";
import { useEdgeAppConfigurationContext } from "../stores/EdgeAppConfigurationContext";
import {
  ConfigurationParameterState,
  ConfigurationV1,
  ConfigurationV2,
} from "../utils/EdgeAppConfigurationFromConsole";

export type UpdateEdgeAppConfigurationState = {
  deviceId: string;
  paramState: ConfigurationParameterState;
  configuration: ConfigurationV1 | ConfigurationV2;
  forceConfigUpdateDevice: boolean;
  setConfiguration: (value: ConfigurationV1 | ConfigurationV2) => void;
  setForceConfigUpdateDevice: (value: boolean) => void;
};

export function useUpdateEdgeAppConfigurationState(): UpdateEdgeAppConfigurationState {
  const { canvasHeight, canvasWidth } = useScreenContext();

  const { deviceId, modelId } = useDeviceModelIdContext();
  const {
    detectionThreshold,
    configuration,
    sendImageFlag,
    uploadInterval,
    forceConfigUpdateDevice,
    setConfiguration,
    setForceConfigUpdateDevice,
  } = useEdgeAppConfigurationContext();

  const paramState: ConfigurationParameterState = {
    modelId: modelId,
    detectionThreshold: detectionThreshold,
    uploadInterval: uploadInterval,
    sendImageFlag: sendImageFlag,
    inputWidth: canvasWidth,
    inputHeight: canvasHeight,
  };

  return {
    deviceId: deviceId,
    paramState: paramState,
    configuration: configuration,
    forceConfigUpdateDevice: forceConfigUpdateDevice,
    setConfiguration: setConfiguration,
    setForceConfigUpdateDevice: setForceConfigUpdateDevice,
  };
}
