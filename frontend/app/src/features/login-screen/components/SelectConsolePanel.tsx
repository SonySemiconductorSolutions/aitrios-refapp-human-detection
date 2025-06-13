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

import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { Box, Card } from "@mui/material";
import { putConsoleType } from "../utils/ConsoleConfiguration";
import { ConsoleType } from "../../../stores/AppContext";

interface SelectConsoleScreenProps {
  consoleName: ConsoleType;
  setConsoleType: (value: ConsoleType) => void;
}

export default function SelectConsolePanel({
  consoleName,
  setConsoleType,
}: SelectConsoleScreenProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsoleType(event.target.value as ConsoleType);
    console.log("Selected Console type:", event.target.value);
    putConsoleType(event.target.value);
  };

  return (
    <Box flexGrow={1} sx={{ mt: 5, minWidth: "clamp(200px, 40vw, 1000px)" }}>
      <Card
        variant="outlined"
        sx={{ alignContent: "center", minHeight: "clamp(100px, 15vh, 200px)" }}
      >
        <FormControl>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Choosing console type
          </Typography>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            row
            value={consoleName}
            onChange={handleChange}
          >
            <FormControlLabel
              value="ONLINE V1"
              control={<Radio />}
              label="Online V1"
            />
            <FormControlLabel
              value="ONLINE V2"
              control={<Radio />}
              label="Online V2"
            />
          </RadioGroup>
        </FormControl>
      </Card>
    </Box>
  );
}
