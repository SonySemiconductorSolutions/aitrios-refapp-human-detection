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

import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import { type SelectChangeEvent } from "@mui/material/Select";
import {
  isInitialStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";
import {
  CustomSelector,
  CustomSelectorItem,
} from "../../../../components/CustomSelector";
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";

export default function ModelSelector() {
  const { screenStage, setScreenStage } = useScreenContext();
  const { deviceId, modelId, setModelId, modelIdsOfDevice } =
    useDeviceModelIdContext();
  const { setForceConfigUpdateDevice } = useEdgeAppConfigurationContext();

  const handleModelSelection = (event: SelectChangeEvent) => {
    const newModelId: string = event.target.value;
    if (newModelId != "") {
      setScreenStage("apply_ready");
    }
    setModelId(event.target.value);
    setForceConfigUpdateDevice(true);
  };

  return (
    <CustomSelector
      label="Select Model"
      disabled={deviceId === "" || !isInitialStages(screenStage)}
      items={modelIdsOfDevice.map((model_id) => {
        return {
          value: model_id,
          name: model_id,
        } as CustomSelectorItem;
      })}
      value={modelId}
      onSelect={handleModelSelection}
    />
  );
}
