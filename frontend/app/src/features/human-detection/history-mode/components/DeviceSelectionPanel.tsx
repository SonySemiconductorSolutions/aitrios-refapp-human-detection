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

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { DeviceSelector } from "../../components/DeviceSelector";
import { useAppContext } from "../../../../stores/AppContext";

export default function DeviceSelectionPanel() {
  const { deviceList } = useAppContext();

  return (
    <Card variant="outlined">
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        m={1}
        spacing={1}
      >
        <Typography variant="body1" fontWeight="bold">
          Select device
        </Typography>
        <DeviceSelector devices={deviceList} />
      </Stack>
    </Card>
  );
}
