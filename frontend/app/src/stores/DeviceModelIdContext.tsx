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

interface Props {
  children: ReactNode;
}

interface ContextType {
  deviceId: string;
  setDeviceId: (value: string) => void;
  modelId: string;
  setModelId: (value: string) => void;
  modelIdsOfDevice: string[];
  setModelIdsOfDevice: (value: string[]) => void;
}

const DeviceModelIdContext = createContext<ContextType>({} as ContextType);

export function DeviceModelIdProvider({ children }: Props) {
  const [deviceId, setDeviceId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [modelIdsOfDevice, setModelIdsOfDevice] = useState<string[]>([]);

  return (
    <DeviceModelIdContext.Provider
      value={{
        deviceId,
        setDeviceId: (value: string) => {
          setDeviceId(value);
          setModelId("");
          setModelIdsOfDevice([]);
        },
        modelId,
        setModelId,
        modelIdsOfDevice,
        setModelIdsOfDevice,
      }}
    >
      {children}
    </DeviceModelIdContext.Provider>
  );
}

export function useDeviceModelIdContext(): ContextType {
  return useContext(DeviceModelIdContext);
}
