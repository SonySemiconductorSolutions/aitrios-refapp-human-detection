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
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import DirectorySelectionPanel from "./DirectorySelectionPanel";
import DateTimeRangePanel from "./DateTimeRangePanel";
import { Tab, Tabs } from "@mui/material";
import { useHistoryDataContext } from "../../../../stores/HistoryDataContext";
import {
  isConfigurationStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";

export default function PlaybackSourcePanel() {
  const { screenStage } = useScreenContext();
  const { fetchImageFlag, setFetchImageFlag } = useHistoryDataContext();

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={0}>
        <Tabs
          value={fetchImageFlag ? 1 : 0} // 0: Metadata Only, 1: Images and Metadata
          onChange={(_e, value) => setFetchImageFlag(Boolean(value))}
          centered
          textColor="primary"
          indicatorColor="primary"
          aria-label="playback source tabs"
        >
          <Tab
            label="Images and Metadata"
            value={1}
            disabled={!isConfigurationStages(screenStage)}
          />
          <Tab
            label="Metadata Only"
            value={0}
            disabled={!isConfigurationStages(screenStage)}
          />
        </Tabs>

        <Box sx={{ width: "100%" }}>
          {!fetchImageFlag && <DateTimeRangePanel />}
          {fetchImageFlag && <DirectorySelectionPanel />}
        </Box>
      </Stack>
    </Card>
  );
}
