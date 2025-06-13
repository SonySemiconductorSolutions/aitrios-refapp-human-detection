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

import { useEffect } from "react";
import { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import {
  CustomSelector,
  CustomSelectorItem,
} from "../../../../components/CustomSelector";
import { ReloadDirectories } from "./ReloadDirectories";
import {
  isConfigurationStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";
import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";

export interface DirectorySelectorProps {
  directories: string[];
}

export function DirectorySelector({ directories }: DirectorySelectorProps) {
  const { screenStage } = useScreenContext();
  const { selectedImageDirectory, setSelectedImageDirectory } =
    useDeviceDirectoryContext();
  const { deviceId } = useDeviceModelIdContext();

  const handleDirectoryChange = (event: SelectChangeEvent) => {
    setSelectedImageDirectory(event.target.value);
  };

  useEffect(() => {
    setSelectedImageDirectory("");
  }, [deviceId]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      m={1}
      spacing={1}
      sx={{
        width: "100%",
        align: "stretch",
      }}
    >
      <CustomSelector
        label="Select Directory"
        disabled={!isConfigurationStages(screenStage)}
        items={
          directories
            ? directories.map((directory) => {
                return {
                  value: directory,
                  name: directory,
                } as CustomSelectorItem;
              })
            : []
        }
        value={selectedImageDirectory}
        onSelect={handleDirectoryChange}
      />
      <ReloadDirectories />
    </Stack>
  );
}
