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

import "./App.css";
import Box from "@mui/material/Box";

import PrincipalScreen from "./features/PrincipalScreen";
import HeaderBar from "./components/HeaderBar";
import baseTheme from "./styles/baseStyle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DeviceModelIdProvider } from "./stores/DeviceModelIdContext";
import { ScreenContextProvider } from "./stores/ScreenContext";
import { EdgeAppConfigurationContextProvider } from "./stores/EdgeAppConfigurationContext";
import { ImageInferenceContextProvider } from "./stores/ImageInferenceContext";
import { AppContextProvider } from "./stores/AppContext";
import { AppConfigContextProvider } from "./stores/AppConfigContext";
import { RegionContextProvider } from "./stores/RegionContext";
import { DeviceDirectoryProvider } from "./stores/DeviceDirectoryContext";
import { DeviceDataTimeRangeProvider } from "./stores/DeviceDataTimeRangeContext";
import { HistoryDataContextProvider } from "./stores/HistoryDataContext";

const theme = createTheme({
  ...baseTheme,
  typography: {
    ...baseTheme.typography,
    fontSize: 14,
    h6: {
      ...baseTheme.typography.h6,
      fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
    },
    body1: {
      ...baseTheme.typography.body1,
      fontSize: "clamp(1rem, 1vw, 1.25rem)",
    },
    body2: {
      ...baseTheme.typography.body2,
      fontSize: "clamp(0.85rem, 0.85vw, 1.05rem)",
    },
  },
  components: {
    ...baseTheme.components,
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          fontSize: "clamp(1rem, 1vw, 1.25rem)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "clamp(1rem, 1vw, 1.25rem)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          margin: "auto",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <AppConfigContextProvider>
          <DeviceModelIdProvider>
            <DeviceDirectoryProvider>
              <DeviceDataTimeRangeProvider>
                <ImageInferenceContextProvider>
                  <HistoryDataContextProvider>
                    <ScreenContextProvider>
                      <HeaderBar />
                      <EdgeAppConfigurationContextProvider>
                        <RegionContextProvider>
                          <Box
                            sx={{
                              width: "clamp(900px, 90vw, 1280px)",
                            }}
                          >
                            <PrincipalScreen />
                          </Box>
                        </RegionContextProvider>
                      </EdgeAppConfigurationContextProvider>
                    </ScreenContextProvider>
                  </HistoryDataContextProvider>
                </ImageInferenceContextProvider>
              </DeviceDataTimeRangeProvider>
            </DeviceDirectoryProvider>
          </DeviceModelIdProvider>
        </AppConfigContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
