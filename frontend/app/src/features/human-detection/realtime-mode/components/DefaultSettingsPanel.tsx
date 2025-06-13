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

import Stack from "@mui/material/Stack";
import CustomSlider from "../../../../components/CustomSlider";
import CustomCheckBox from "../../../../components/CustomCheckBox";
import {
  isInferenceStages,
  isInitialStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";
import {
  maxDetectionThreshold,
  minDetectionThreshold,
  stepDetectionThreshold,
} from "../../../../stores/constants";

export default function DefaultSettingsPanel() {
  const { screenStage } = useScreenContext();
  const {
    detectionThreshold,
    sendImageFlag,
    setDetectionThreshold,
    setSendImageFlag,
  } = useEdgeAppConfigurationContext();

  const disableParameterChange: boolean =
    isInferenceStages(screenStage) ||
    isInitialStages(screenStage) ||
    screenStage === "parameter_loading";

  return (
    <Stack spacing={2}>
      {[
        {
          title: "Detection Threshold (fraction)",
          tooltip:
            "Threshold on the bounding box confidence to keep a detection",
          variableValue: detectionThreshold,
          setVariableValue: setDetectionThreshold,
          min: minDetectionThreshold,
          max: maxDetectionThreshold,
          step: stepDetectionThreshold,
        },
      ].map((parameters) => {
        return (
          <CustomSlider
            title={parameters.title}
            tooltip={parameters.tooltip}
            variableValue={parameters.variableValue}
            setVariableValue={parameters.setVariableValue}
            min={parameters.min}
            max={parameters.max}
            step={parameters.step}
            disabled={disableParameterChange}
            key={parameters.title}
          />
        );
      })}

      <CustomCheckBox
        title="Send Image"
        description="Send the input tensor image synchronized with the telemetry data. On a Type 3 device, this will limit the telemetry rate to around 1 telemetry every 3 seconds."
        disabled={disableParameterChange}
        variable={sendImageFlag}
        setVariable={setSendImageFlag}
      />
    </Stack>
  );
}
