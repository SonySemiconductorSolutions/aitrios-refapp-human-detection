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

import ImageVisualizationPanel from "./components/ImageVisualizationPanel";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import {
  isPeopleCountInRegions,
  useAppContext,
} from "../../../stores/AppContext";
import PlaybackSourcePanel from "./components/PlaybackSourcePanel";
import PlaybackControlPanel from "./components/PlaybackControlPanel";
import RegionSelectionPanel from "../components/RegionSelectionPanel";
import DeviceSelectionPanel from "./components/DeviceSelectionPanel";
import ExtraInfoPanel from "./components/ExtraInfoPanel";
import LoadingSpinner from "../components/LoadingSpinner";

function HIstoryScreen() {
  const { solutionType } = useAppContext();

  return (
    <>
      <LoadingSpinner />
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 6, md: 5 }}>
          <Stack spacing={1}>
            <DeviceSelectionPanel />
            {isPeopleCountInRegions(solutionType) && <RegionSelectionPanel />}
            <PlaybackSourcePanel />
            <PlaybackControlPanel />
          </Stack>
        </Grid>
        <Grid size={{ xs: 9, md: 7 }}>
          <Stack spacing={1}>
            <ImageVisualizationPanel />
            <ExtraInfoPanel />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default HIstoryScreen;
