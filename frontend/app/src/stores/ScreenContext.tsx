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

import { createContext, useState, type ReactNode, useContext } from "react";
import { canvasMaxWidth, canvasMaxHeight } from "./constants";

export type ScreenStage =
  | "initial"
  | "apply_ready"
  | "parameter_loading"
  | "parameter_selection"
  | "extra_parameter_selection"
  | "zone_selection"
  | "inference_starting"
  | "inference_running"
  | "inference_stopping";
const preRunStages: ScreenStage[] = ["initial", "apply_ready"];
export const isInitialStages = (stage: ScreenStage) =>
  preRunStages.indexOf(stage) > -1;
const inferenceStages: ScreenStage[] = [
  "inference_starting",
  "inference_running",
  "inference_stopping",
];
export const isInferenceStages = (stage: ScreenStage) =>
  inferenceStages.indexOf(stage) > -1;
const configurationStages: ScreenStage[] = [
  "parameter_selection",
  "extra_parameter_selection",
];
export const isConfigurationStages = (stage: ScreenStage) =>
  configurationStages.indexOf(stage) > -1;
export const isLoadingStage = (stage: ScreenStage) => {
  return (
    stage === "inference_starting" ||
    stage === "inference_stopping" ||
    stage === "parameter_loading"
  );
};

interface Props {
  children: ReactNode;
}

interface ScreenContextType {
  screenStage: ScreenStage;
  canvasHeight: number;
  canvasWidth: number;
  setScreenStage: (value: ScreenStage) => void;
  setCanvasHeight: (value: number) => void;
  setCanvasWidth: (value: number) => void;
}

const ScreenContext = createContext<ScreenContextType>({} as ScreenContextType);

export function ScreenContextProvider({ children }: Props) {
  const [screenStage, setScreenStage] = useState<ScreenStage>("initial");
  const [canvasHeight, setCanvasHeight] = useState<number>(canvasMaxHeight);
  const [canvasWidth, setCanvasWidth] = useState<number>(canvasMaxWidth);
  return (
    <ScreenContext.Provider
      value={{
        screenStage,
        canvasHeight,
        canvasWidth,
        setScreenStage,
        setCanvasHeight,
        setCanvasWidth,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreenContext(): ScreenContextType {
  return useContext(ScreenContext);
}
