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

import { getImageDirectories } from "../../../../utils/ImagesAndInferencesFromConsole";
import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";

export function ReloadDirectories() {
  const { deviceId } = useDeviceModelIdContext();
  const { setImageDirectoriesOfDevice } = useDeviceDirectoryContext();

  function handleReload() {
    if (deviceId !== "") {
      getImageDirectories(deviceId).then((res) => {
        setImageDirectoriesOfDevice(res ? res : []);
      });
    }
  }

  return (
    <Tooltip title="Reload the information of image directories">
      <Button
        variant="contained"
        onClick={() => handleReload()}
        style={{ fontSize: "10px", float: "right" }}
        sx={{ width: "10%" }}
      >
        <CachedIcon />
      </Button>
    </Tooltip>
  );
}
