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

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Point } from "../types/types";

interface CoordinateDivProps {
  mainText: string;
  x: number;
  y: number;
}

function CoordinateDiv({ mainText, x, y }: CoordinateDivProps) {
  return (
    <div style={{ display: "contents" }}>
      {[mainText, "(x:", x + ",", "y:", y + ")"].map((text, i) => {
        return (
          <Typography
            variant="body1"
            align={i === 0 ? "left" : "right"}
            children={text}
            key={i}
          />
        );
      })}
    </div>
  );
}

interface CoordinateTableProps {
  startPoint: Point;
  endPoint: Point;
  firstRowTitle: string;
  secondRowTitle: string;
}

export default function CoordinateTable({
  startPoint,
  endPoint,
  firstRowTitle,
  secondRowTitle,
}: CoordinateTableProps) {
  return (
    <Stack direction="column">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto auto",
          padding: "0 1rem 0 0",
        }}
      >
        <CoordinateDiv
          mainText={firstRowTitle}
          x={isNaN(startPoint.x) ? 0 : startPoint.x}
          y={isNaN(startPoint.x) ? 0 : startPoint.y}
        />
        <CoordinateDiv
          mainText={secondRowTitle}
          x={isNaN(endPoint.x) ? 0 : endPoint.x}
          y={isNaN(endPoint.y) ? 0 : endPoint.y}
        />
      </div>
    </Stack>
  );
}
