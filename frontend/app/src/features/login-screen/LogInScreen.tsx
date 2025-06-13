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

import OnlineCredentialsPanel from "./components/OnlineCredentialsPanel";
import SelectConsolePanel from "./components/SelectConsolePanel";
import { useAppContext } from "../../stores/AppContext";
import Box from "@mui/material/Box";

export default function LogInScreen() {
  const { consoleType, setConsoleType } = useAppContext();

  let configurationPanel = null;
  if (consoleType == "ONLINE V1" || consoleType == "ONLINE V2") {
    configurationPanel = <OnlineCredentialsPanel consoleType={consoleType} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
        minHeight: "100%", // Ensures it takes at least the full screen height
      }}
    >
      <Box>
        <SelectConsolePanel
          consoleName={consoleType}
          setConsoleType={setConsoleType}
        />
        {configurationPanel}
      </Box>
    </Box>
  );
}
