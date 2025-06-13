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

import { Tabs, Tab, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import {
  isConfigurationStages,
  useScreenContext,
} from "../../../stores/ScreenContext";

interface BBoxHumanoidSwitchProps {
  showHumanoid: boolean;
  setShowHumanoid: (value: boolean) => void;
}

export default function BBoxHumanoidTab({
  showHumanoid,
  setShowHumanoid,
}: BBoxHumanoidSwitchProps) {
  const { screenStage } = useScreenContext();
  const [selectedTab, setSelectedTab] = useState(showHumanoid ? 1 : 0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setShowHumanoid(newValue === 1);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{
            height: "2rem",
            minHeight: "2rem",
          }}
        >
          <Tab
            label={
              <Tooltip title="Display basic bounding boxes">
                <Typography variant="body2">Simple View</Typography>
              </Tooltip>
            }
            sx={{
              minHeight: "2rem",
              padding: "0 0.5rem",
            }}
            disabled={
              !isConfigurationStages(screenStage) &&
              screenStage != "inference_running"
            }
          />
          <Tab
            label={
              <Tooltip title="Display human skeletons">
                <Typography variant="body2">Humanoid View</Typography>
              </Tooltip>
            }
            sx={{
              minHeight: "2rem",
              padding: "0 0.5rem",
            }}
            disabled={
              !isConfigurationStages(screenStage) &&
              screenStage != "inference_running"
            }
          />
        </Tabs>
      </Grid>
    </Grid>
  );
}
