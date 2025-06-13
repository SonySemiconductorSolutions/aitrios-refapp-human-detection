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
import Box from "@mui/material/Box";
import { Serie } from "@nivo/line";
import CustomResponsiveLine from "../../../../components/CustomResponsiveLine";
import { parseTimestampToDate } from "../../utils/dateTimeFormatters";

import { PeopleCountTelemetry } from "../../../../types/types";

function convertData(peopleCountTelemetries: PeopleCountTelemetry[]): Serie[] {
  const data: Serie[] = [
    {
      id: "people_count",
      data: peopleCountTelemetries
        .filter(
          (telemetry) =>
            telemetry?.timestamp != null && telemetry?.people_count != null,
        )
        .map((telemetry) => {
          return {
            x: parseTimestampToDate(telemetry.timestamp),
            y: telemetry.people_count,
          };
        }),
    },
  ];
  return data;
}

export default function PeopleCountPlot({
  telemetries,
}: {
  telemetries: PeopleCountTelemetry[];
}) {
  const [displayData, setDisplayData] = useState<PeopleCountTelemetry[]>([]);

  useEffect(() => {
    const latest = [...telemetries];
    setDisplayData(latest);
  }, [telemetries]);

  return (
    <>
      <strong>Telemetry history</strong>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {displayData.length > 0 ? (
          <CustomResponsiveLine
            data={convertData(displayData)}
            axisBottomLabel="Time"
            axisLeftLabel="People count"
            width={"full"}
            height={250}
            showLegend={true}
            integerYAxis={true}
          />
        ) : (
          <Typography variant="body1">No data available</Typography>
        )}
      </Box>
    </>
  );
}
