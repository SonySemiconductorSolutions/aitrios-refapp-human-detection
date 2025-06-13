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
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { type FormEventHandler } from "react";
import {
  CommandParameters,
  ConfigurationV1,
  ConfigurationV2,
  EdgeAppInfo,
  frameRateToTimeBetweenUpdates,
  isConfigurationV1,
  isConfigurationV2,
  updateParametersInConfiguration,
} from "../../../../utils/EdgeAppConfigurationFromConsole";
import {
  minDetectionThreshold,
  maxDetectionThreshold,
} from "../../../../stores/constants";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";

function validateModifiedConfig(
  config: string,
): ConfigurationV1 | ConfigurationV2 {
  if (config.includes("edge_app")) {
    return JSON.parse(config) as ConfigurationV2;
  } else {
    return JSON.parse(config) as ConfigurationV1;
  }
}

function getNewParametersV1(config: ConfigurationV1): any {
  let newParameters: any = null;
  config.commands.forEach((command) => {
    if (command.parameters) {
      newParameters = command.parameters;
    }
  });
  return newParameters;
}

function getNewParametersV2(config: ConfigurationV2): any {
  return (
    config.edge_app.custom_settings?.ai_models?.detection?.parameters ?? null
  );
}

export function getErrorStringForInvalidPPLParametersV2(
  edgeAppInfo: EdgeAppInfo,
  modelIdsOfDevice: string[],
): string {
  let errors: string[] = [];
  let ai_parameters = edgeAppInfo.custom_settings?.ai_models.detection;
  if (
    !modelIdsOfDevice.some((str) =>
      str.includes(ai_parameters.ai_model_bundle_id),
    )
  ) {
    errors.push("Invalid model ID");
  }
  if (ai_parameters.parameters.input_width < 0) {
    errors.push(
      "custom_settings.ai_models.detection.parameters.input_width can't be < 0",
    );
  }
  if (ai_parameters.parameters.input_height < 0) {
    errors.push(
      "custom_settings.ai_models.detection.parameters.input_height can't be < 0",
    );
  }
  if (
    ai_parameters.parameters.threshold < minDetectionThreshold ||
    ai_parameters.parameters.threshold > maxDetectionThreshold
  ) {
    errors.push(
      "custom_settings.ai_models.detection.parameters.threshold out of bounds",
    );
  }
  if (
    !edgeAppInfo.common_settings ||
    edgeAppInfo.common_settings.process_state < 0 ||
    edgeAppInfo.common_settings.process_state > 2
  ) {
    errors.push(
      "Invalid common_settings.process_state value, valid values are: [0, 1, 2]",
    );
  }
  return errors.join(", ");
}

export function getErrorStringForInvalidPPLParametersV1(
  parameters: any,
  modelIdsOfDevice: string[],
): string {
  let errors: string[] = [];
  if (parameters.PPLParameter.input_width < 0) {
    errors.push("PPLParameter.input_width can't be < 0");
  }
  if (parameters.PPLParameter.input_height < 0) {
    errors.push("PPLParameter.input_height can't be < 0");
  }
  if (
    parameters.PPLParameter.threshold < minDetectionThreshold ||
    parameters.PPLParameter.threshold > maxDetectionThreshold
  ) {
    errors.push("threshold score out of bounds");
  }
  if (!modelIdsOfDevice.includes(parameters.ModelId)) {
    errors.push("Invalid model ID");
  }
  if (parameters.Mode < 0 || parameters.Mode > 2) {
    errors.push("Invalid Mode value, valid values are: [0, 1, 2]");
  }
  return errors.join(", ");
}

export default function ExtraSettingsPanel() {
  const { setScreenStage } = useScreenContext();
  const { modelId, setModelId, modelIdsOfDevice } = useDeviceModelIdContext();
  const {
    detectionThreshold,
    uploadInterval,
    sendImageFlag,
    configuration,
    setDetectionThreshold,
    setUploadInterval,
    setSendImageFlag,
    setConfiguration,
    setForceConfigUpdateDevice,
  } = useEdgeAppConfigurationContext();
  const { canvasHeight, canvasWidth, setCanvasHeight, setCanvasWidth } =
    useScreenContext();
  const updatedConfiguration = updateParametersInConfiguration(
    {
      modelId: modelId,
      detectionThreshold: detectionThreshold,
      uploadInterval: uploadInterval,
      sendImageFlag: sendImageFlag,
      inputWidth: canvasWidth,
      inputHeight: canvasHeight,
    },
    configuration,
  );
  const [currText, setCurrText] = useState<string>(
    JSON.stringify(updatedConfiguration, null, 2),
  );

  const updatePPLParametersInConfigV2 = (
    prevConfiguration: ConfigurationV2,
    newConfig: ConfigurationV2,
  ) => {
    const newParameters = getNewParametersV2(newConfig);
    if (newParameters == null) {
      alert("Invalid JSON, `parameters` field missing!");
      return;
    }
    const errorString = getErrorStringForInvalidPPLParametersV2(
      newConfig.edge_app,
      modelIdsOfDevice,
    );

    if (errorString != "") {
      alert("Invalid JSON, `parameters` field invalid: " + errorString);
      return;
    }

    if (newConfig.edge_app.custom_settings) {
      if (!prevConfiguration.edge_app.custom_settings) {
        prevConfiguration.edge_app.custom_settings =
          newConfig.edge_app.custom_settings;
      } else {
        if (
          prevConfiguration.edge_app.custom_settings.ai_models["detection"][
            "parameters"
          ]["input_width"] != newParameters["input_width"]
        ) {
          setCanvasWidth(newParameters["input_width"]);
        }
        if (
          prevConfiguration.edge_app.custom_settings.ai_models["detection"][
            "parameters"
          ]["input_height"] != newParameters["input_height"]
        ) {
          setCanvasHeight(newParameters["input_height"]);
        }
        if (
          prevConfiguration.edge_app.custom_settings.ai_models.detection
            .parameters.threshold != newParameters.threshold
        ) {
          setDetectionThreshold(newParameters.threshold);
        }
        if (
          prevConfiguration.edge_app.custom_settings.ai_models.detection
            .ai_model_bundle_id !=
          newConfig.edge_app.custom_settings.ai_models?.detection
            .ai_model_bundle_id
        ) {
          setModelId(
            newConfig.edge_app.custom_settings.ai_models.detection
              .ai_model_bundle_id,
          );
        }
      }
    }
    if (
      newConfig.edge_app.common_settings &&
      prevConfiguration.edge_app.common_settings
    ) {
      if (
        prevConfiguration.edge_app.common_settings.pq_settings["frame_rate"][
          "num"
        ] != newConfig.edge_app.common_settings.pq_settings["frame_rate"]["num"]
      ) {
        setUploadInterval(
          frameRateToTimeBetweenUpdates(
            newConfig.edge_app.common_settings.pq_settings["frame_rate"]["num"],
            newConfig.edge_app.common_settings.pq_settings["frame_rate"][
              "denom"
            ],
          ),
        );
      }
      if (
        prevConfiguration.edge_app.common_settings.port_settings.input_tensor
          .enabled !=
        newConfig.edge_app.common_settings.port_settings.input_tensor.enabled
      ) {
        setSendImageFlag(
          newConfig.edge_app.common_settings.port_settings.input_tensor.enabled,
        );
      }
    }
    prevConfiguration.edge_app = newConfig.edge_app;
  };

  const updatePPLParametersInConfigV1 = (
    prevConfiguration: ConfigurationV1,
    newConfig: ConfigurationV1,
  ) => {
    const newParameters = getNewParametersV1(newConfig);
    if (newParameters == null) {
      alert("Invalid JSON, `PPLParameter` field missing!");
      return;
    }
    const errorString = getErrorStringForInvalidPPLParametersV1(
      newParameters,
      modelIdsOfDevice,
    );

    if (errorString != "") {
      alert("Invalid JSON, `PPLParameter` field invalid: " + errorString);
      return;
    }
    const parametersToUpdate: (keyof CommandParameters)[] = [
      "FileFormat",
      "UploadMethod",
      "UploadMethodIR",
      "NumberOfImages",
      "MaxDetectionsPerFrame",
    ];

    prevConfiguration.commands.forEach((command) => {
      if (command.parameters.PPLParameter) {
        if (
          command.parameters.PPLParameter.threshold !=
          newParameters.PPLParameter.threshold
        ) {
          setDetectionThreshold(newParameters.PPLParameter.threshold);
        }
        if (
          command.parameters.PPLParameter.input_width !=
          newParameters.PPLParameter.input_width
        ) {
          setCanvasWidth(newParameters.PPLParameter.input_width);
        }
        if (
          command.parameters.PPLParameter.input_height !=
          newParameters.PPLParameter.input_height
        ) {
          setCanvasHeight(newParameters.PPLParameter.input_height);
        }
        command.parameters.PPLParameter = newParameters.PPLParameter;
      }
      if (command.parameters.ModelId) {
        command.parameters.ModelId = newParameters.ModelId;
        setModelId(newParameters.ModelId ?? "");
      }
      if (command.parameters.UploadInterval) {
        command.parameters.UploadInterval = newParameters.UploadInterval;
        setUploadInterval(newParameters.UploadInterval);
      }
      if (command.parameters.Mode) {
        command.parameters.Mode = newParameters.Mode;
        setSendImageFlag(newParameters.Mode == 1);
      }

      parametersToUpdate.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(command.parameters, key)) {
          command.parameters[key] = newParameters[key];
        }
      });
    });
  };

  const updatePPLParametersInConfig = (
    newConfig: ConfigurationV1 | ConfigurationV2,
  ) => {
    if (isConfigurationV2(configuration)) {
      if (isConfigurationV2(newConfig)) {
        updatePPLParametersInConfigV2(configuration, newConfig);
      } else {
        alert("New configuration has a wrong format");
        return;
      }
    } else {
      if (isConfigurationV1(newConfig)) {
        updatePPLParametersInConfigV1(configuration, newConfig);
      } else {
        alert("New configuration has a wrong format");
        return;
      }
    }
    setConfiguration(configuration);
  };

  const handleClickApply = () => {
    let newConfig: ConfigurationV1 | ConfigurationV2 | null = null;
    try {
      newConfig = validateModifiedConfig(currText);
    } catch (e) {
      alert("Invalid JSON: " + e);
      return;
    }
    updatePPLParametersInConfig(newConfig!);
    setForceConfigUpdateDevice(true);
    console.log("Validated correctly");
    setScreenStage("parameter_selection");
  };

  const handleOnInput: FormEventHandler = (e) => {
    const target = e.target as HTMLTextAreaElement;
    setCurrText(target.value ? target.value : "");
  };

  return (
    <>
      <Stack direction="column" spacing={1.5}>
        <TextareaAutosize
          minRows={5}
          maxRows={50}
          defaultValue={currText}
          onInput={handleOnInput}
        />

        <Tooltip title="Apply (store) the JSON parameters. Only changes to the PPLParameter field will be stored.">
          <Button
            variant="contained"
            onClick={handleClickApply}
            sx={{ width: "10%" }}
          >
            Apply
          </Button>
        </Tooltip>
      </Stack>
    </>
  );
}
