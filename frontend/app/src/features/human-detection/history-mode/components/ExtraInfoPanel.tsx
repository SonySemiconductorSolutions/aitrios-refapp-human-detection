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

import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";

import {
  isPeopleCount,
  isPeopleCountInRegions,
  useAppContext,
} from "../../../../stores/AppContext.tsx";
import { useHistoryDataContext } from "../../../../stores/HistoryDataContext.tsx";
import {
  PeopleCountInference,
  PeopleCountInRegionsInference,
  PeopleCountInRegionsTelemetry,
  PeopleCountTelemetry,
} from "../../../../types/types.tsx";
import PeopleCountPlot from "./PeopleCountPlot.tsx";
import PeopleCountInRegionsPlot from "./PeopleCountInRegionsPlot.tsx";

export default function ExtraInfoPanel() {
  const { solutionType } = useAppContext();
  const { historyData } = useHistoryDataContext();

  if (!isPeopleCount(solutionType) && !isPeopleCountInRegions(solutionType)) {
    return null;
  }

  let telemetries: PeopleCountTelemetry[] | PeopleCountInRegionsTelemetry[] =
    [];

  if (isPeopleCount(solutionType) && Array.isArray(historyData.data)) {
    telemetries = historyData.data
      .map((item) => ({
        timestamp: item?.timestamp,
        people_count:
          (item.inference as PeopleCountInference)?.people_count || null,
      }))
      .filter(
        (telemetry) =>
          telemetry?.timestamp != null && telemetry?.people_count != null,
      );
  }

  if (isPeopleCountInRegions(solutionType) && Array.isArray(historyData.data)) {
    telemetries = historyData.data
      .map((item) => ({
        timestamp: item?.timestamp,
        people_count_in_regions: (
          item.inference as PeopleCountInRegionsInference
        )?.people_count_in_regions,
      }))
      .filter(
        (telemetry) =>
          telemetry?.timestamp != null &&
          telemetry?.people_count_in_regions != null,
      );
  }

  return (
    <>
      <Grid size={12}>
        <Card variant="outlined" sx={{ p: 2 }}>
          {isPeopleCount(solutionType) && (
            <PeopleCountPlot
              telemetries={telemetries as PeopleCountTelemetry[]}
            />
          )}
          {isPeopleCountInRegions(solutionType) && (
            <PeopleCountInRegionsPlot
              telemetries={telemetries as PeopleCountInRegionsTelemetry[]}
            />
          )}
        </Card>
      </Grid>
    </>
  );
}
