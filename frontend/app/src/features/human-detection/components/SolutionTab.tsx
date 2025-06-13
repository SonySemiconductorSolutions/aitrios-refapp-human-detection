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

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material/Button";

import {
  isConfigurationStages,
  useScreenContext,
} from "../../../stores/ScreenContext";
import {
  isRealtimeScreenActive,
  isHistoryScreenActive,
  SolutionType,
  useAppContext,
} from "../../../stores/AppContext";
import {
  useResetRealtimeMode,
  useResetHistoryMode,
} from "../../../hooks/ResetStateHooks";
import { useInferenceControl } from "../realtime-mode/hooks/useInferenceControl";
import { fetchImage } from "../../../utils/GetImageFromConsole";
import { useDeviceModelIdContext } from "../../../stores/DeviceModelIdContext";
import { useImageInferenceContext } from "../../../stores/ImageInferenceContext";

export const TabButtonGroup = ({ children }: { children: React.ReactNode }) => (
  <Box display="flex">{children}</Box>
);

type TabButtonProps = ButtonProps & {
  id: string;
  isSelected: boolean;
};

export const TabButton = ({
  id,
  isSelected,
  sx,
  children,
  ...props
}: TabButtonProps) => {
  return (
    <Button
      {...props}
      variant={isSelected ? "contained" : "outlined"}
      color={isSelected ? "primary" : "inherit"}
      sx={{
        textTransform: "none",
        ...sx,
      }}
    >
      <Typography>{children}</Typography>
    </Button>
  );
};

export default function SolutionTab() {
  const { solutionType, setSolutionType, appState, isSocketActive } =
    useAppContext();
  const { deviceId } = useDeviceModelIdContext();
  const { screenStage, setScreenStage } = useScreenContext();
  const { resetStateRealtimeMode } = useResetRealtimeMode();
  const { resetStateHistoryMode } = useResetHistoryMode();
  const { StopInference } = useInferenceControl();
  const { setImageSrc } = useImageInferenceContext();

  const handleSolutionChange = async (
    newSolutionType: SolutionType,
  ): Promise<void> => {
    if (solutionType === newSolutionType) return;

    try {
      if (isRealtimeScreenActive(appState)) {
        if (isSocketActive) {
          await StopInference();
        }
        resetStateRealtimeMode();
        setScreenStage("parameter_loading");
        const imageResult = await fetchImage(deviceId);
        const imageSrc = `data:image/jpeg;base64,${imageResult.replace(/"/g, "")}`;
        setImageSrc(imageSrc);
      }

      if (isHistoryScreenActive(appState)) {
        resetStateHistoryMode();
      }

      setScreenStage("parameter_selection");
      setSolutionType(newSolutionType);
    } catch (error) {
      console.error(
        "Error stopping processing while changing solution type:",
        error,
      );
      setScreenStage("parameter_selection");
    }
  };

  return (
    <TabButtonGroup>
      <TabButton
        id="PeopleCount"
        isSelected={solutionType === "PeopleCount"}
        onClick={() => handleSolutionChange("PeopleCount")}
        disabled={
          !isConfigurationStages(screenStage) &&
          screenStage != "inference_running"
        }
        sx={{ borderRadius: "8px 0 0 8px" }}
      >
        People Count
      </TabButton>
      <TabButton
        id="PeopleCountInRegions"
        isSelected={solutionType === "PeopleCountInRegions"}
        onClick={() => handleSolutionChange("PeopleCountInRegions")}
        disabled={
          !isConfigurationStages(screenStage) &&
          screenStage != "inference_running"
        }
        sx={{ borderRadius: 0 }}
      >
        People Count in Regions
      </TabButton>
      <TabButton
        id="Heatmap"
        isSelected={solutionType === "Heatmap"}
        onClick={() => handleSolutionChange("Heatmap")}
        disabled={
          !isConfigurationStages(screenStage) &&
          screenStage != "inference_running"
        }
        sx={{ borderRadius: "0 8px 8px 0" }}
      >
        Heat Map
      </TabButton>
    </TabButtonGroup>
  );
}
