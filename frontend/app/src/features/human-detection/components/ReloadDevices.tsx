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

import CachedIcon from "@mui/icons-material/Cached";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import {
  isInitialStages,
  useScreenContext,
} from "../../../stores/ScreenContext";
import { getDeviceList } from "../../../utils/DeviceInfoFromConsole";
import {
  isRealtimeScreenActive,
  useAppContext,
} from "../../../stores/AppContext";

export function ReloadDevices() {
  const { screenStage } = useScreenContext();
  const { appState, setDeviceList } = useAppContext();

  function handleReload() {
    getDeviceList().then((res) => {
      setDeviceList(res);
    });
  }

  return (
    <Tooltip title="Reload the information of available devices">
      <span>
        <Button
          variant="contained"
          onClick={() => handleReload()}
          style={{ fontSize: "10px" }}
          sx={{ width: "10%" }}
          disabled={
            isRealtimeScreenActive(appState) && !isInitialStages(screenStage)
          }
        >
          <CachedIcon />
        </Button>
      </span>
    </Tooltip>
  );
}
