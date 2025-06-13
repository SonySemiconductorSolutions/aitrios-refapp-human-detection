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

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

export type CustomSelectorItem = {
  value: string;
  name: string;
  state?: boolean | null;
};

interface CustomSelectorProps {
  label: string;
  items: CustomSelectorItem[];
  value?: string;
  disabled?: boolean;
  onSelect: (event: SelectChangeEvent) => void;
  onOpen?: (event: any) => void;
}

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    top: "50%",
    transform: "translate(-75%, -50%)",
    padding: "0 4px",
  },
}));

export function CustomSelector({
  label,
  items,
  value,
  disabled = false,
  onSelect,
  onOpen,
}: CustomSelectorProps) {
  return (
    <FormControl disabled={disabled} size="small" sx={{ width: "90%" }}>
      <InputLabel data-testid={"input-label " + label}>{label}</InputLabel>

      <Select
        data-testid={"select " + label}
        label={label}
        value={value}
        onChange={onSelect}
        onOpen={onOpen}
      >
        <MenuItem key="" value="" sx={{ m: 1 }}>
          <em>None</em>
        </MenuItem>

        {items.map((item) => (
          <MenuItem
            key={item.name}
            value={item.value}
            sx={{ justifyContent: "space-between", m: 1 }}
          >
            <StyledBadge
              badgeContent={""}
              invisible={!(typeof item.state === "boolean")}
              color={item.state ? "success" : "error"}
              variant="dot"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Tooltip title={item.value}>
                <span>
                  <Typography
                    variant="body1"
                    align="left"
                    children={item.name}
                    sx={{ flexGrow: 1, padding: "0 0 0 5px" }}
                  />
                </span>
              </Tooltip>
            </StyledBadge>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
