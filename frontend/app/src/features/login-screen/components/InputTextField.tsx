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

import { ChangeEvent } from "react";

import TextField from "@mui/material/TextField";

interface InputTextFieldProps {
  variableValue: string;
  setVariableValue: (value: string) => void;
  error: boolean;
}

export default function InputTextField({
  variableValue,
  setVariableValue,
  error,
}: InputTextFieldProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setVariableValue(newValue);
  };

  return (
    <TextField
      fullWidth
      id="outlined-required"
      label={error ? "Erroneous credentials" : "Required"}
      value={variableValue}
      onChange={handleInputChange}
      variant="outlined"
      error={error}
    />
  );
}
