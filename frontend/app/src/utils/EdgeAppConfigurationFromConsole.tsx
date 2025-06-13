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

import { StatusResponse } from "../types/types";
import {
  defaultInputHeight,
  defaultInputWidth,
  defaultDetectionThreshold,
  defaultTimeBetweenUploads,
  defaultSendImageFlag,
  defaultModelId,
  minTimeBetweenUploads,
  maxTimeBetweenUploads,
  minDetectionThreshold,
  maxDetectionThreshold,
  defaultMaxDetections,
  defaultDnnOutputDetections,
} from "../stores/constants";
import { v4 as uuidv4 } from "uuid";
import { ConsoleType } from "../stores/AppContext";

export type CommandParameters = {
  Mode: number;
  UploadMethod?: string;
  FileFormat?: string;
  UploadMethodIR?: string;
  NumberOfImages?: number;
  UploadInterval?: number;
  MaxDetectionsPerFrame?: number;
  ModelId?: string;
  PPLParameter?: any;
};

export type Command = {
  command_name: string;
  parameters: CommandParameters;
};

export type ResInfoData = {
  [key: string]: unknown;
  res_id: string;
};

export type InferenceSettingsData = {
  number_of_iterations: number;
};

export type MetadataData = {
  path: string;
  method: number;
  enabled: boolean;
  endpoint: string;
  storage_name: string;
};

export type InputTensorData = {
  path: string;
  method: number;
  enabled: boolean;
  endpoint: string;
  storage_name: string;
};

export type PortSettingsData = {
  metadata: MetadataData;
  input_tensor: InputTensorData;
};

export type CodecSettingsData = {
  format: number;
};

export type CommonSettingsData = {
  process_state: number;
  log_level: number;
  inference_settings: InferenceSettingsData;
  pq_settings?: any;
  port_settings: PortSettingsData;
  codec_settings: CodecSettingsData;
  number_of_inference_per_message: number;
};

export type MetadataSettingsData = {
  format: number;
};

export type CustomSettingsData = {
  ai_models: any;
  metadata_settings?: MetadataSettingsData | null;
  res_info?: ResInfoData | null;
};

export type EdgeAppInfo = {
  res_info?: ResInfoData;
  common_settings?: CommonSettingsData;
  custom_settings?: CustomSettingsData;
};

export type ConfigurationV1 = {
  file_name: string;
  commands: Command[];
};

export type ConfigurationV2 = {
  edge_app: EdgeAppInfo;
};

export function isConfigurationV2(
  configuration: ConfigurationV1 | ConfigurationV2,
): configuration is ConfigurationV2 {
  return "edge_app" in configuration;
}

export function isConfigurationV1(
  configuration: ConfigurationV1 | ConfigurationV2,
): configuration is ConfigurationV1 {
  return !("edge_app" in configuration);
}

export interface ConfigurationParameterState {
  modelId: string;
  uploadInterval: number; // a refresh interval for detection results (web app-specific parameter)
  sendImageFlag: boolean; // deduced from the "Mode" in the CommandParameters
  [prop: string]: any;
}

/*
Parses the json object into a CommandParameters object
*/
export function jsonToParameter(json: any): CommandParameters {
  const parameters: CommandParameters = json
    ? (json as CommandParameters)
    : { Mode: -1 };

  if (parameters["Mode"] == -1) {
    console.log("Mode not contained in json: ", json);
  }
  return parameters;
}

/*
Parses a json object into a Command object that contains a command name as `command_name` and command parameters as `parameters`
*/
export function jsonToCommand(json: any): Command {
  const command: Command = {
    command_name: json["command_name"] ? json["command_name"] : "undefined",
    parameters: jsonToParameter(json["parameters"]),
  };
  if (command["command_name"] == "undefined") {
    console.log("command_name not contained in json: ", json);
  }
  return command;
}

export function jsonToCommonSettings(json: any): CommonSettingsData {
  const commonSettings: CommonSettingsData = {
    process_state: json["process_state"],
    log_level: json["log_level"],
    inference_settings: json["inference_settings"],
    pq_settings: json["pq_settings"] ? json["pq_settings"] : {},
    port_settings: json["port_settings"],
    codec_settings: json["codec_settings"],
    number_of_inference_per_message: json["number_of_inference_per_message"],
  };
  return commonSettings;
}

export function jsonToCustomSettings(json: any): CustomSettingsData {
  const customSettings: CustomSettingsData = {
    ai_models: json["ai_models"],
    metadata_settings: json["metadata_settings"],
    res_info: json["res_info"] ? json["res_info"] : null,
  };
  return customSettings;
}

export function jsonToEdgeApp(json: any): EdgeAppInfo {
  const edgeApp: EdgeAppInfo = {
    res_info: json["res_info"] ? json["res_info"] : {},
    common_settings: jsonToCommonSettings(json["common_settings"]),
    custom_settings: jsonToCustomSettings(json["custom_settings"]),
  };
  return edgeApp;
}

/*
Calls backend to retrieve a configuration file for a specific device.
*/
export async function getConfigurationV1(
  deviceId: string,
): Promise<ConfigurationV1> {
  const url = import.meta.env.VITE_BACKEND_URL + "configurations/" + deviceId;
  console.log("API call: ", url);
  const response = await fetch(url);
  let configuration: ConfigurationV1 = {
    file_name: "null",
    commands: [],
  };
  try {
    const json = await response.json();
    console.log("configuration json: ", json);
    configuration = {
      file_name: json["file_name"],
      commands: json["commands"].map((commandJson: any) =>
        jsonToCommand(commandJson),
      ),
    };
  } catch (error) {
    alert(
      "Info: couldn't get configuration information from the Console. Going to create and bind a new command parameter file to the selected device. Set up the values correctly to match the edge app's expectations.",
    );
    console.error(
      "Error getting configuration information from the Console: ",
      error,
    );
    throw error;
  }
  return configuration;
}

export async function getConfigurationV2(
  deviceId: string,
): Promise<ConfigurationV2> {
  const url = import.meta.env.VITE_BACKEND_URL + "configurations/" + deviceId;
  console.log("API call: ", url);
  const response = await fetch(url);
  if (response.ok) {
    try {
      const json = await response.json();
      let configuration: ConfigurationV2 = {
        edge_app: jsonToEdgeApp(json["edge_app"]),
      };
      return configuration;
    } catch (error) {
      alert("Info: couldn't get configuration information from the Console.");
      console.error(
        "Error getting configuration information from the Console: ",
        error,
      );
      throw error;
    }
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.detail);
  }
}

export function frameRateToTimeBetweenUpdates(
  uploadInterval: number,
  denominator?: number,
): number {
  if (typeof denominator != "undefined") {
    return uploadInterval / denominator / 30;
  } else {
    return uploadInterval / 30;
  }
}

export function timeBetweenUpdatesToFrameRate(
  timeBetweenUpdates: number,
  denominator?: number,
): number {
  if (typeof denominator != "undefined") {
    return timeBetweenUpdates * denominator * 30;
  } else {
    return timeBetweenUpdates * 30;
  }
}

function parseUploadInterval(UploadInterval: number): number {
  if (isNaN(UploadInterval)) {
    return defaultTimeBetweenUploads;
  }
  if (UploadInterval < minTimeBetweenUploads) {
    return minTimeBetweenUploads;
  } else if (UploadInterval > maxTimeBetweenUploads) {
    return maxTimeBetweenUploads;
  }
  return UploadInterval;
}

function parseDetectionThreshold(DetectionThreshold: number): number {
  if (isNaN(DetectionThreshold)) {
    return defaultDetectionThreshold;
  } else if (DetectionThreshold < minDetectionThreshold) {
    return minDetectionThreshold;
  } else if (DetectionThreshold > maxDetectionThreshold) {
    return maxDetectionThreshold;
  }
  return DetectionThreshold;
}

function getDetectionThreshold(threshold: number | undefined): number {
  if (threshold === undefined) {
    return defaultDetectionThreshold;
  }
  return parseDetectionThreshold(threshold);
}

export async function putNewConfiguration(
  deviceId: string,
  configuration: ConfigurationV1 | ConfigurationV2,
): Promise<StatusResponse> {
  const url = import.meta.env.VITE_BACKEND_URL + "configurations/" + deviceId;
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(configuration),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error("Failed to post new configuration: " + response.json());
  }
  console.log("Replaced with new configuration: " + response.json());
  return { status: response.status.toString() };
}

export function getDefaultConfiguration(file_name: string): ConfigurationV1 {
  let parameters: CommandParameters;
  parameters = {
    Mode: 1,
    PPLParameter: {
      input_height: defaultInputHeight,
      input_width: defaultInputWidth,
      max_detections: defaultMaxDetections,
      dnn_output_detections: defaultDnnOutputDetections,
      threshold: defaultDetectionThreshold,
    },
  };
  const command: Command = {
    command_name: "StartUploadInferenceData",
    parameters: parameters,
  };
  const configuration: ConfigurationV1 = {
    file_name: file_name,
    commands: [command],
  };
  return configuration;
}

export function getDefaultConfigurationV2(modelId: string): CustomSettingsData {
  return {
    ai_models: {
      detection: {
        ai_model_bundle_id: modelId.substring(6, 12),
        parameters: {
          max_detections: 10,
          threshold: 0.3,
          input_width: 320,
          input_height: 320,
        },
      },
    },
    metadata_settings: {
      format: 0,
    },
  };
}

function fillInMissingValuesWithDefault(
  configuration: ConfigurationV2,
  modelId: string,
): [ConfigurationV2, boolean] {
  const defaultCustomSettings: CustomSettingsData =
    getDefaultConfigurationV2(modelId);
  let isUpdated: boolean = false;
  if (!configuration.edge_app.custom_settings?.ai_models) {
    configuration.edge_app.custom_settings = defaultCustomSettings;
    isUpdated = true;
  } else {
    if (
      !configuration.edge_app.custom_settings.ai_models ||
      !configuration.edge_app.custom_settings.ai_models.detection
    ) {
      configuration.edge_app.custom_settings.ai_models =
        defaultCustomSettings.ai_models;
      isUpdated = true;
    } else if (
      !configuration.edge_app.custom_settings.ai_models.detection.parameters
    ) {
      configuration.edge_app.custom_settings.ai_models.detection.parameters =
        defaultCustomSettings.ai_models.detection.parameters;
      isUpdated = true;
    }
    if (!configuration.edge_app.custom_settings.metadata_settings) {
      configuration.edge_app.custom_settings.metadata_settings =
        defaultCustomSettings.metadata_settings;
      isUpdated = true;
    }
  }
  return [configuration, isUpdated];
}

/*
Calls backend to retrieve a configuration file for a specific device and parses it to extract only the relevant parameters.
*/
export async function getInitialValuesFromConfiguration(
  deviceId: string,
  consoleType: ConsoleType,
  modelId: string,
): Promise<
  [ConfigurationParameterState, ConfigurationV1 | ConfigurationV2, boolean]
> {
  if (consoleType == "ONLINE V2") {
    let initialConfiguration: ConfigurationV2;
    initialConfiguration = await getConfigurationV2(deviceId);

    let requiresUpdate;
    [initialConfiguration, requiresUpdate] = fillInMissingValuesWithDefault(
      initialConfiguration,
      modelId,
    );
    if (initialConfiguration.edge_app.custom_settings) {
      initialConfiguration.edge_app.custom_settings.ai_models.detection.ai_model_bundle_id =
        modelId.substring(6, 12);
    }
    if (requiresUpdate) {
      await sendConfiguration(deviceId, initialConfiguration).then(async () => {
        console.log("Replaced configuration of device ", deviceId);
      });
    }

    const configParamState: ConfigurationParameterState =
      parseConfigurationV2(initialConfiguration);
    return [configParamState, initialConfiguration, false];
  } else {
    const file_name: string = uuidv4() + ".json";
    let isDefaultConfig: boolean = false;
    let initialConfiguration: ConfigurationV1 =
      getDefaultConfiguration(file_name);
    await getConfigurationV1(deviceId)
      .then((result: ConfigurationV1) => {
        initialConfiguration = result;
      })
      .catch(async () => {
        await putNewConfiguration(deviceId, initialConfiguration).then(
          async () => {
            console.log("Replaced configuration of device ", deviceId);
          },
        );
      });
    const configParamState: ConfigurationParameterState =
      parseConfigurationV1(initialConfiguration);
    return [configParamState, initialConfiguration, isDefaultConfig];
  }
}

export function parseConfigurationV2(
  initialConfiguration: ConfigurationV2,
): ConfigurationParameterState {
  const configParamState: ConfigurationParameterState = {
    modelId: defaultModelId,
    detectionThreshold: defaultDetectionThreshold,
    uploadInterval: defaultTimeBetweenUploads,
    sendImageFlag: defaultSendImageFlag,
    inputWidth: defaultInputWidth,
    inputHeight: defaultInputHeight,
  };

  try {
    if (initialConfiguration.edge_app.custom_settings?.ai_models["detection"]) {
      configParamState["inputWidth"] =
        initialConfiguration.edge_app.custom_settings?.ai_models["detection"][
          "parameters"
        ]["input_width"] ?? defaultInputWidth;
      configParamState["inputHeight"] =
        initialConfiguration.edge_app.custom_settings?.ai_models["detection"][
          "parameters"
        ]["input_height"] ?? defaultInputHeight;
      configParamState["detectionThreshold"] =
        initialConfiguration.edge_app.custom_settings?.ai_models["detection"][
          "parameters"
        ]["threshold"];
    }
    configParamState["sendImageFlag"] =
      initialConfiguration.edge_app.common_settings?.port_settings.input_tensor
        .enabled ?? false;
    configParamState["uploadInterval"] = frameRateToTimeBetweenUpdates(
      initialConfiguration.edge_app.common_settings?.pq_settings["frame_rate"][
        "num"
      ],
      initialConfiguration.edge_app.common_settings?.pq_settings["frame_rate"][
        "denom"
      ],
    );
  } catch (e) {
    console.log("error parsing configuration", e);
  }
  return configParamState;
}

export function parseConfigurationV1(
  initialConfiguration: ConfigurationV1,
): ConfigurationParameterState {
  const configParamState: ConfigurationParameterState = {
    modelId: defaultModelId,
    detectionThreshold: defaultDetectionThreshold,
    uploadInterval: defaultTimeBetweenUploads,
    sendImageFlag: defaultSendImageFlag,
    inputWidth: defaultInputWidth,
    inputHeight: defaultInputHeight,
  };

  try {
    const commands = initialConfiguration["commands"];

    commands.map((command) => {
      const parameters: CommandParameters = command["parameters"];
      configParamState["sendImageFlag"] = parameters["Mode"] != 2;
      if (parameters["UploadInterval"]) {
        configParamState["uploadInterval"] = parseUploadInterval(
          parameters["UploadInterval"],
        );
      }

      if (parameters["PPLParameter"]) {
        if (parameters["PPLParameter"]["input_width"]) {
          configParamState["inputWidth"] =
            parameters["PPLParameter"]["input_width"];
        }
        if (parameters["PPLParameter"]["input_height"]) {
          configParamState["inputHeight"] =
            parameters["PPLParameter"]["input_height"];
        }
        if (parameters["PPLParameter"]["threshold"]) {
          configParamState["detectionThreshold"] = getDetectionThreshold(
            parameters["PPLParameter"]["threshold"],
          );
        }
      }
    });
  } catch (e) {
    console.log("error parsing configuration", e);
  }
  return configParamState;
}

/*
Patches the values of the CommandParamaterFile file specified in the config.file_name
*/
export async function sendConfiguration(
  deviceId: string,
  config: ConfigurationV1 | ConfigurationV2,
): Promise<void> {
  const url = import.meta.env.VITE_BACKEND_URL + "configurations/" + deviceId;
  console.log("API call: ", url);
  try {
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify(config),
    });
    console.log(
      "Waiting for 5 seconds to give time to the configuration to be applied.",
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (e) {
    console.log(
      "Error sending configuration information to the Console. Error: ",
      e,
    );
  }
}

/*Cleans up an object by deleting fields with undefined values.*/
export function deleteUndefinedValuesIteratively(elem: object): void {
  for (const keyStr in elem) {
    let key = keyStr as keyof typeof elem;
    if (elem[key] === undefined || elem[key] === null) {
      delete elem[key];
    }
    if (typeof elem[key] === "object") {
      deleteUndefinedValuesIteratively(elem[key]);
    }
  }
}

/*
Updates the Configuration with the values of ConfigurationParameterState.
*/
export function updateParametersInConfigurationV1(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV1,
): ConfigurationV1 {
  let new_configuration: ConfigurationV1 = configuration;
  new_configuration.commands.forEach((command) => {
    command.parameters.ModelId = paramState.modelId;
    command.parameters.Mode = paramState.sendImageFlag ? 1 : 2;
    command.parameters.UploadInterval = paramState.uploadInterval;
    if (command.parameters.PPLParameter.threshold) {
      command.parameters.PPLParameter = {
        ...command.parameters.PPLParameter,
        threshold: paramState.detectionThreshold,
      };
    }
    deleteUndefinedValuesIteratively(command);
  });
  return new_configuration;
}

export function updateParametersInConfigurationV2(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV2,
): ConfigurationV2 {
  let new_configuration: ConfigurationV2 = configuration;
  if (new_configuration.edge_app.common_settings) {
    new_configuration.edge_app.common_settings.port_settings.input_tensor.enabled =
      paramState.sendImageFlag;
    new_configuration.edge_app.common_settings.pq_settings["frame_rate"][
      "num"
    ] = timeBetweenUpdatesToFrameRate(
      paramState.uploadInterval,
      new_configuration.edge_app.common_settings.pq_settings["frame_rate"][
        "denom"
      ],
    );
  }
  if (new_configuration.edge_app.custom_settings?.ai_models["detection"]) {
    new_configuration.edge_app.custom_settings.ai_models["detection"][
      "parameters"
    ]["threshold"] = paramState.detectionThreshold;
  }
  return new_configuration;
}

export function updateParametersInConfiguration(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV1 | ConfigurationV2,
): ConfigurationV1 | ConfigurationV2 {
  if (isConfigurationV2(configuration)) {
    return updateParametersInConfigurationV2(paramState, configuration);
  } else {
    return updateParametersInConfigurationV1(paramState, configuration);
  }
}

export function doParametersDifferFromLastConfigurationV1(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV1,
): boolean {
  for (const command of configuration.commands) {
    const modeParamState: number = paramState.sendImageFlag ? 1 : 2;
    if (
      command.parameters.Mode != modeParamState ||
      command.parameters.UploadInterval != paramState.uploadInterval ||
      command.parameters.ModelId != paramState.modelId
    ) {
      return true;
    }
    if (
      command.parameters.PPLParameter &&
      command.parameters.PPLParameter.threshold
    ) {
      if (
        command.parameters.PPLParameter.threshold !=
        Number(paramState.detectionThreshold)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function doParametersDifferFromLastConfigurationV2(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV2,
): boolean {
  if (
    configuration.edge_app.common_settings?.port_settings.input_tensor
      .enabled != paramState.sendImageFlag ||
    frameRateToTimeBetweenUpdates(
      configuration.edge_app.common_settings?.pq_settings["frame_rate"]["num"],
      configuration.edge_app.common_settings?.pq_settings["frame_rate"][
        "denom"
      ],
    ) != paramState.uploadInterval
  ) {
    return true;
  }
  if (configuration.edge_app.custom_settings) {
    if (
      configuration.edge_app.custom_settings.ai_models["detection"] &&
      configuration.edge_app.custom_settings.ai_models["detection"][
        "parameters"
      ]["threshold"] != Number(paramState.detectionThreshold)
    ) {
      return true;
    }
  }
  return false;
}

/*
Checks if any parameter in the Configuration was changed by comparing it with the ConfigurationParameterState.
*/
export function doParametersDifferFromLastConfiguration(
  paramState: ConfigurationParameterState,
  configuration: ConfigurationV1 | ConfigurationV2,
): boolean {
  if (isConfigurationV2(configuration)) {
    return doParametersDifferFromLastConfigurationV2(paramState, configuration);
  } else {
    return doParametersDifferFromLastConfigurationV1(paramState, configuration);
  }
}
