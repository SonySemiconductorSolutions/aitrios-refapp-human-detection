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

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  useAppContext,
  isLoggedIn,
  isHistoryScreenActive,
  isLoginScreenActive,
  isRealtimeScreenActive,
} from "../stores/AppContext";
import { useEffect } from "react";
import { connectToImageStream } from "../utils/ImageStream";
import { useImageInferenceContext } from "../stores/ImageInferenceContext";
import LoginIcon from "@mui/icons-material/Login";
import {
  useResetRealtimeMode,
  useResetHistoryMode,
} from "../hooks/ResetStateHooks";
import { useInferenceControl } from "../features/human-detection/realtime-mode/hooks/useInferenceControl";
import { useScreenContext } from "../stores/ScreenContext";

function capitalizeFirstLetter(value: string) {
  return (
    String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
  );
}

export default function HeaderBar() {
  const {
    consoleType,
    appState,
    credentialsState,
    isSocketActive,
    setAppState,
  } = useAppContext();
  const { setScreenStage } = useScreenContext();
  const { handleReceiveDataPoint } = useImageInferenceContext();
  const { resetStateRealtimeMode } = useResetRealtimeMode();
  const { resetStateHistoryMode } = useResetHistoryMode();
  const { StopInference } = useInferenceControl();

  useEffect(() => {
    let cleanup: () => void = () => {};
    if (isSocketActive) {
      cleanup = connectToImageStream(handleReceiveDataPoint);
    }
    return cleanup;
  }, [isSocketActive]);

  const setLoginScreen = async () => {
    if (isLoginScreenActive(appState)) return;

    if (isSocketActive) {
      await StopInference();
    }
    resetStateRealtimeMode();
    resetStateHistoryMode();

    setAppState("login");
  };

  const setRealtimeScreen = async () => {
    if (isRealtimeScreenActive(appState)) return;

    resetStateHistoryMode();
    setAppState("realtime_screen");
    setScreenStage("initial");
  };

  const setHistoryScreen = async () => {
    if (isHistoryScreenActive(appState)) return;

    try {
      if (isSocketActive) {
        await StopInference();
      }
      resetStateRealtimeMode();
      setAppState("history_screen");
      setScreenStage("initial");
    } catch (error) {
      console.error("Error while switching to HISTORY MODE:", error);
    }
  };

  function ScreenButton({
    label,
    isActive,
    onClick,
    disabled,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled: boolean;
  }) {
    return (
      <Button
        variant="contained"
        color="inherit"
        sx={{
          marginLeft: "auto",
          fontSize: "1rem",
          color: isActive ? "#3e445b" : "#bec2d1",
          backgroundColor: isActive ? undefined : "#545B70",
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  }

  return (
    <>
      <AppBar style={{ position: "fixed" }}>
        <Toolbar>
          <Button
            variant="contained"
            color="inherit"
            sx={{ marginRight: "auto" }}
            children={<LoginIcon style={{ color: "#3e445b" }} />}
            onClick={setLoginScreen}
          />

          <Box display="flex" flexDirection="column">
            <Typography variant="h6" align="left" sx={{ flexGrow: 1 }}>
              {import.meta.env.VITE_APP_TITLE}
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            sx={{ flexGrow: 0.95, marginRight: "auto" }}
          >
            <Typography align="right" sx={{ flexGrow: 1, fontSize: "1rem" }}>
              Selected Console Type:
            </Typography>
            <Typography align="right" sx={{ flexGrow: 1, fontSize: "1rem" }}>
              {capitalizeFirstLetter(consoleType)}
            </Typography>
          </Box>

          <ScreenButton
            label="Realtime"
            isActive={isRealtimeScreenActive(appState)}
            onClick={setRealtimeScreen}
            disabled={!isLoggedIn(credentialsState)}
          />
          <ScreenButton
            label="History"
            isActive={isHistoryScreenActive(appState)}
            onClick={setHistoryScreen}
            disabled={!isLoggedIn(credentialsState)}
          />
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer to account for the fixed HeaderBar height */}
    </>
  );
}
