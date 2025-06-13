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

// https://mui.com/material-ui/react-slider/#slider-with-input-field
import { useEffect, useState, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import Tooltip from "@mui/material/Tooltip";

interface CustomSliderProps {
  title: string;
  tooltip: string;
  variableValue: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  setVariableValue: (count: number) => void;
}

const Input = styled(MuiInput)`
  width: 60px;
`;

export default function CustomSlider({
  title,
  tooltip,
  variableValue,
  min,
  max,
  step,
  disabled = true,
  setVariableValue,
}: CustomSliderProps) {
  const [inputText, setInputText] = useState<string>(() =>
    variableValue.toString(),
  );
  useEffect(() => {
    setInputText(variableValue.toString());
  }, [variableValue]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setVariableValue(newValue as number);
    setInputText(newValue.toString());
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setInputText(newValue);
  };

  const validateNumber = async (num: number) => {
    if (isNaN(num)) return Promise.reject("isNaN");
    if (num > max) return max; //return Promise.resolve(max), since it's async'd
    if (num < min) return min;
    return num;
  };

  useEffect(
    () => {
      if (inputText === variableValue.toString()) return;

      const timeout = setTimeout(() => {
        const newValue = Number(inputText);
        validateNumber(newValue)
          .then((num) => {
            setVariableValue(num);
            setInputText(num.toString());
          })
          .catch(() => {
            setInputText(variableValue.toString());
          });
      }, 500);
      return () => clearTimeout(timeout);
    },
    //eslint-disable-next-line
    [inputText, variableValue],
  );

  return (
    <Tooltip title={tooltip}>
      <Box id={title}>
        <Typography id={"input-slider" + title}>{title}</Typography>
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid width={"75%"}>
            <Slider
              value={variableValue}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              valueLabelDisplay="auto"
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
          </Grid>
          <Grid width={"15%"}>
            <Input
              value={inputText}
              size="small"
              onChange={handleInputChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>
    </Tooltip>
  );
}
