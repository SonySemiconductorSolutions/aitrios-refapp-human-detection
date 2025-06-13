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

import { useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useDeviceDataTimeRangeContext } from "../../../../stores/DeviceDataTimeRangeContext";

export default function DateTimeRangePanel() {
  const {
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    setIsDateTimeRangeValid,
  } = useDeviceDataTimeRangeContext();

  useEffect(() => {
    const initialStartDateTime = dayjs();
    const initialEndDateTime = dayjs();

    setStartDateTime(initialStartDateTime);
    setEndDateTime(initialEndDateTime);
  }, [setStartDateTime, setEndDateTime]);

  useEffect(() => {
    const isValid = startDateTime.isBefore(endDateTime);
    setIsDateTimeRangeValid(isValid);
  }, [startDateTime, endDateTime]);

  const handleDateChange = (isStart: boolean) => (date: Dayjs | null) => {
    if (!date) return;

    const currentDateTime = isStart ? startDateTime : endDateTime;
    if (!currentDateTime) return;

    const newDateTime = date
      .hour(currentDateTime.hour())
      .minute(currentDateTime.minute())
      .second(currentDateTime.second());

    if (isStart) {
      console.log("Start DateTime:", newDateTime);
      setStartDateTime(newDateTime);
    } else {
      console.log("End DateTime:", newDateTime);
      setEndDateTime(newDateTime);
    }
  };

  const handleTimeChange = (isStart: boolean) => (time: Dayjs | null) => {
    if (!time) return;

    const currentDateTime = isStart ? startDateTime : endDateTime;
    if (!currentDateTime) return;

    const newDateTime = currentDateTime
      .hour(time.hour())
      .minute(time.minute())
      .second(time.second());

    if (isStart) {
      setStartDateTime(newDateTime);
    } else {
      setEndDateTime(newDateTime);
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2, maxWidth: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={1}>
          {[
            {
              label: "START",
              dateTime: startDateTime,
              handleDateChange: handleDateChange(true),
              handleTimeChange: handleTimeChange(true),
            },
            {
              label: "END",
              dateTime: endDateTime,
              handleDateChange: handleDateChange(false),
              handleTimeChange: handleTimeChange(false),
            },
          ].map(({ label, dateTime, handleDateChange, handleTimeChange }) => (
            <Grid
              container
              key={label}
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid size={2}>
                <Typography>{label}</Typography>
              </Grid>
              <Grid size={5}>
                <DatePicker
                  value={dateTime}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <TimePicker
                  value={dateTime}
                  onChange={handleTimeChange}
                  format="HH:mm"
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Stack>
      </LocalizationProvider>
    </Card>
  );
}
