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
import { HistoryData } from "../types/types";

interface Props {
  children: ReactNode;
}

interface ContextType {
  fetchImageFlag: boolean;
  setFetchImageFlag: (value: boolean) => void;
  isPlaybackActive: boolean;
  setIsPlaybackActive: (isPlaybackActive: boolean) => void;
  historyData: HistoryData;
  setHistoryData: (data: HistoryData) => void;
}

const HistoryDataContext = createContext<ContextType>({} as ContextType);

export function HistoryDataContextProvider({ children }: Props) {
  const [fetchImageFlag, setFetchImageFlag] = useState<boolean>(true);
  const [isPlaybackActive, setIsPlaybackActive] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryData>({ data: [] });

  return (
    <HistoryDataContext.Provider
      value={{
        fetchImageFlag,
        setFetchImageFlag,
        isPlaybackActive,
        setIsPlaybackActive,
        historyData,
        setHistoryData,
      }}
    >
      {children}
    </HistoryDataContext.Provider>
  );
}

export function useHistoryDataContext(): ContextType {
  return useContext(HistoryDataContext);
}
