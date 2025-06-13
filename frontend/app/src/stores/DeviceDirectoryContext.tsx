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
  imageDirectoriesOfDevice: string[];
  setImageDirectoriesOfDevice: (value: string[]) => void;
  selectedImageDirectory: string;
  setSelectedImageDirectory: (value: string) => void;
}

const DeviceDirectoryContext = createContext<ContextType>({} as ContextType);

export function DeviceDirectoryProvider({ children }: Props) {
  const [imageDirectoriesOfDevice, setImageDirectoriesOfDevice] = useState<
    string[]
  >([]);
  const [selectedImageDirectory, setSelectedImageDirectory] =
    useState<string>("");

  return (
    <DeviceDirectoryContext.Provider
      value={{
        imageDirectoriesOfDevice,
        setImageDirectoriesOfDevice,
        selectedImageDirectory,
        setSelectedImageDirectory,
      }}
    >
      {children}
    </DeviceDirectoryContext.Provider>
  );
}

export function useDeviceDirectoryContext(): ContextType {
  return useContext(DeviceDirectoryContext);
}
