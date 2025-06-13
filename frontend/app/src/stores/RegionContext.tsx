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

import {
  createContext,
  useState,
  type ReactNode,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { SelectedRegionId, Point, Region } from "../types/types";
import {
  defaultEnableRegionIds,
  defaultSelectedRegionId,
  defaultStartPoint,
  defaultEndPoint,
  defaultRegions,
} from "./constants";
import { fetchAppConfig, AppConfig } from "../utils/AppConfig";

interface Props {
  children: ReactNode;
}

interface ContextType {
  enableRegionIds: string[];
  setEnableRegionIds: (value: string[]) => void;
  selectedRegionId: SelectedRegionId;
  setSelectedRegionId: (value: SelectedRegionId) => void;
  dragStartPoint: Point;
  setDragStartPoint: (value: Point) => void;
  dragEndPoint: Point;
  setDragEndPoint: (value: Point) => void;
  selectedRegions: Region[];
  setSelectedRegions: Dispatch<SetStateAction<Region[]>>;
  updateSelectedRegions: (prevRegions: Region[], newRegion: Region) => Region[];
}

const RegionContext = createContext<ContextType>({} as ContextType);

export function RegionContextProvider({ children }: Props) {
  const [enableRegionIds, setEnableRegionIds] = useState<string[]>(
    defaultEnableRegionIds,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<SelectedRegionId>(
    defaultSelectedRegionId,
  );
  const [dragStartPoint, setDragStartPoint] =
    useState<Point>(defaultStartPoint);
  const [dragEndPoint, setDragEndPoint] = useState<Point>(defaultEndPoint);
  const [selectedRegions, setSelectedRegions] =
    useState<Region[]>(defaultRegions);

  const updateSelectedRegions = (
    prevRegions: Region[],
    newRegion: Region,
  ): Region[] => {
    return prevRegions.some((region) => region.id === newRegion.id)
      ? prevRegions.map((region) =>
          region.id === newRegion.id ? newRegion : region,
        )
      : [...prevRegions, newRegion];
  };

  useEffect(() => {
    const initializeAppConfig = async () => {
      const appConfig: AppConfig = await fetchAppConfig();
      setSelectedRegions(appConfig.people_count_in_regions_settings.regions);
    };

    initializeAppConfig();
  }, []);

  return (
    <RegionContext.Provider
      value={{
        enableRegionIds,
        setEnableRegionIds,
        selectedRegionId,
        setSelectedRegionId,
        dragStartPoint,
        setDragStartPoint,
        dragEndPoint,
        setDragEndPoint,
        selectedRegions,
        setSelectedRegions,
        updateSelectedRegions,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegionContext(): ContextType {
  return useContext(RegionContext);
}
