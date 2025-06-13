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

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";

interface CustomCheckBoxProps {
  title: string;
  description: string;
  disabled: boolean;
  variable: boolean;
  setVariable: (checked: boolean) => void;
}

export default function CustomCheckBox({
  title,
  description,
  disabled,
  variable,
  setVariable,
}: CustomCheckBoxProps) {
  return (
    <Tooltip title={description}>
      <span>
        <FormControlLabel
          control={
            <Checkbox
              disabled={disabled}
              checked={variable}
              onChange={(e) => {
                setVariable(e.target.checked);
              }}
            />
          }
          label={title}
        />
      </span>
    </Tooltip>
  );
}
