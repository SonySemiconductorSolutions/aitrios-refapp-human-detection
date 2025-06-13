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

import { createContext, useState, type ReactNode, useContext } from "react";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  children: ReactNode;
}

interface ContextType {
  startDateTime: Dayjs;
  setStartDateTime: (value: Dayjs) => void;
  endDateTime: Dayjs;
  setEndDateTime: (value: Dayjs) => void;
  isDateTimeRangeValid: boolean;
  setIsDateTimeRangeValid: (value: boolean) => void;
}

const DeviceDataTimeRangeContext = createContext<ContextType>(
  {} as ContextType,
);

export function DeviceDataTimeRangeProvider({ children }: Props) {
  const [startDateTime, setStartDateTime] = useState<Dayjs>(dayjs());
  const [endDateTime, setEndDateTime] = useState<Dayjs>(dayjs());
  const [isDateTimeRangeValid, setIsDateTimeRangeValid] =
    useState<boolean>(false);

  return (
    <DeviceDataTimeRangeContext.Provider
      value={{
        startDateTime,
        setStartDateTime,
        endDateTime,
        setEndDateTime,
        isDateTimeRangeValid,
        setIsDateTimeRangeValid,
      }}
    >
      {children}
    </DeviceDataTimeRangeContext.Provider>
  );
}

export function useDeviceDataTimeRangeContext(): ContextType {
  return useContext(DeviceDataTimeRangeContext);
}
