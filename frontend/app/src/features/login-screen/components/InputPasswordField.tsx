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

import { useState, MouseEvent, ChangeEvent } from "react";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface InputPasswordFieldProps {
  variableValue: string;
  setVariableValue: (value: string) => void;
  error: boolean;
}

export default function InputPasswordField({
  variableValue,
  setVariableValue,
  error,
}: InputPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setVariableValue(newValue);
  };

  return (
    <OutlinedInput
      id="outlined-adornment-password"
      type={showPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label={
              showPassword ? "hide the password" : "display the password"
            }
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            onMouseUp={handleMouseUpPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      value={variableValue}
      onChange={handleInputChange}
      label={error ? "Erroneous credentials" : "Password"}
      fullWidth
      error={error}
    />
  );
}
