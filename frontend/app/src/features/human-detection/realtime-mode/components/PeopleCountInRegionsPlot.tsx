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

import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Serie } from "@nivo/line";
import {
  PeopleCountInRegionsTelemetry,
  useImageInferenceContext,
} from "../../../../stores/ImageInferenceContext";
import CustomResponsiveLine from "../../../../components/CustomResponsiveLine";
import { parseTimestampToDate } from "../../utils/dateTimeFormatters";

function convertData(
  recentTelemetries: PeopleCountInRegionsTelemetry[],
): Serie[] {
  const regionIds = new Set<string>();
  recentTelemetries.forEach((telemetry) => {
    if (telemetry.people_count_in_regions) {
      Object.keys(telemetry.people_count_in_regions).forEach((regionId) => {
        regionIds.add(regionId);
      });
    }
  });
  const data: Serie[] = Array.from(regionIds).map((regionId, index) => {
    return {
      id: `${regionId}`,
      data: recentTelemetries
        .filter(
          (telemetry) =>
            telemetry?.timestamp != null &&
            telemetry?.people_count_in_regions?.[regionId] != null,
        )
        .map((telemetry) => {
          const baseDate = parseTimestampToDate(telemetry.timestamp);
          const adjustedDate = new Date(baseDate.getTime() + index); // To avoid key errors, add 1 millisecond per index.
          return {
            x: adjustedDate,
            y: telemetry.people_count_in_regions[regionId],
          };
        }),
    };
  });
  return data;
}

export default function PeopleCountInRegionsPlot() {
  const { peopleCountInRegionsTelemetries } = useImageInferenceContext();
  const [displayData, setDisplayData] = useState<
    PeopleCountInRegionsTelemetry[]
  >([]);

  useEffect(() => {
    if (peopleCountInRegionsTelemetries.length > 0) {
      const latest = [...peopleCountInRegionsTelemetries].slice(-20);
      setDisplayData(latest);
    }
  }, [peopleCountInRegionsTelemetries]);

  return (
    <>
      <strong>Last 20 telemetries</strong>
      {displayData.length > 0 ? (
        <CustomResponsiveLine
          data={convertData(displayData)}
          axisBottomLabel="Time"
          axisLeftLabel="People count in regions"
          width={"full"}
          height={250}
          showLegend={true}
          integerYAxis={true}
        />
      ) : (
        <Typography variant="body1">No data available</Typography>
      )}
    </>
  );
}
