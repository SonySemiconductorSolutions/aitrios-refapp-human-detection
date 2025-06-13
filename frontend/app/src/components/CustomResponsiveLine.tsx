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

import { ResponsiveLine, Serie } from "@nivo/line";

function generateTickXValues(data: readonly Serie[]): string | undefined {
  if (data.length === 0 || data[0].data.length === 0) {
    return "every 1 second";
  }

  const firstPoint = data[0].data[0];
  const lastPoint = data[0].data[data[0].data.length - 1];

  if (!firstPoint || !lastPoint || !firstPoint.x || !lastPoint.x) {
    return "every 1 second";
  }

  const firstTime = Number(firstPoint.x);
  const lastTime = Number(lastPoint.x);
  const timeDifference = lastTime - firstTime;

  if (timeDifference <= 20 * 1000) {
    return "every 1 second";
  } else if (timeDifference <= 60 * 1000) {
    return "every 5 seconds";
  } else {
    return undefined;
  }
}

function getNiceYMax(data: readonly Serie[]): number {
  const maxY = Math.max(
    ...data.flatMap((series) => series.data.map((d) => d.y as number)),
  );

  if (maxY <= 5) return 5;
  if (maxY <= 10) return 10;
  if (maxY <= 30) return Math.ceil(maxY / 5) * 5;
  if (maxY <= 50) return Math.ceil(maxY / 10) * 10;
  return Math.ceil(maxY / 50) * 50;
}

function generateTickYValues(
  niceMax: number,
  integerYAxis: boolean,
): number[] | number {
  if (!integerYAxis) {
    return 5;
  }

  let step;
  if (niceMax <= 5) step = 1;
  else if (niceMax <= 10) step = 2;
  else if (niceMax <= 30) step = 5;
  else if (niceMax <= 50) step = 10;
  else step = Math.ceil(niceMax / 5);

  const tickYValues = [];
  for (let i = 0; i <= niceMax; i += step) {
    tickYValues.push(i);
  }
  return tickYValues;
}

export default function CustomResponsiveLine({
  data,
  axisLeftLabel,
  axisBottomLabel,
  width = "full",
  height,
  showLegend,
  integerYAxis = true,
}: {
  data: readonly Serie[];
  axisLeftLabel: string;
  axisBottomLabel: string;
  width?: number | string;
  height: number;
  nrTicks?: number;
  showLegend: boolean;
  integerYAxis?: boolean;
}) {
  const tickXValues = generateTickXValues(data);
  const niceYMax = getNiceYMax(data);
  const tickYValues = generateTickYValues(niceYMax, integerYAxis);

  return (
    <div
      style={{
        height: height,
        width: width === "full" ? "100%" : `${width}px`,
      }}
    >
      <ResponsiveLine
        data={data}
        margin={{
          top: 30,
          right: 60,
          bottom: 80,
          left: 60,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickValues: tickXValues,
          tickPadding: 10,
          tickRotation: 60,
          format: "%H:%M:%S",
          legend: axisBottomLabel,
          legendOffset: 70,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickValues: tickYValues,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisLeftLabel,
          legendOffset: -40,
          legendPosition: "middle",
        }}
        xScale={{
          type: "time",
          useUTC: false,
          precision: "millisecond",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: niceYMax,
        }}
        legends={
          showLegend
            ? [
                {
                  anchor: "top",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: -25,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  toggleSerie: true,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                },
              ]
            : []
        }
        isInteractive={true}
        animate={false}
        useMesh={true}
      />
    </div>
  );
}
