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
} from "react";
import {
  defaultPeopleCountBboxToPointRatio,
  defaultPeopleCountInRegionsBboxToPointRatio,
  defaultHeatmapBboxToPointRatio,
  defaultHeatmapLastValidFrame,
  defaultHeatmapImageSizeW,
  defaultHeatmapImageSizeH,
  defaultHeatmapGridNumW,
  defaultHeatmapGridNumH,
} from "./constants";
import { fetchAppConfig, AppConfig } from "../utils/AppConfig";

interface Props {
  children: ReactNode;
}

interface ContextType {
  peopleCountBboxToPointRatio: number;
  setPeopleCountBboxToPointRatio: (value: number) => void;
  peopleCountInRegionsBboxToPointRatio: number;
  setPeopleCountInRegionsBboxToPointRatio: (value: number) => void;
  heatmapBboxToPointRatio: number;
  setHeatmapBboxToPointRatio: (value: number) => void;
  heatmapLastValidFrame: number;
  setHeatmapLastValidFrame: (value: number) => void;
  heatmapImageSizeW: number;
  setHeatmapImageSizeW: (value: number) => void;
  heatmapImageSizeH: number;
  setHeatmapImageSizeH: (value: number) => void;
  heatmapGridNumW: number;
  setHeatmapGridNumW: (value: number) => void;
  heatmapGridNumH: number;
  setHeatmapGridNumH: (value: number) => void;
}

const AppConfigContext = createContext<ContextType>({} as ContextType);

export function AppConfigContextProvider({ children }: Props) {
  const [peopleCountBboxToPointRatio, setPeopleCountBboxToPointRatio] =
    useState<number>(defaultPeopleCountBboxToPointRatio);
  const [
    peopleCountInRegionsBboxToPointRatio,
    setPeopleCountInRegionsBboxToPointRatio,
  ] = useState<number>(defaultPeopleCountInRegionsBboxToPointRatio);
  const [heatmapBboxToPointRatio, setHeatmapBboxToPointRatio] =
    useState<number>(defaultHeatmapBboxToPointRatio);
  const [heatmapLastValidFrame, setHeatmapLastValidFrame] = useState<number>(
    defaultHeatmapLastValidFrame,
  );
  const [heatmapImageSizeW, setHeatmapImageSizeW] = useState<number>(
    defaultHeatmapImageSizeW,
  );
  const [heatmapImageSizeH, setHeatmapImageSizeH] = useState<number>(
    defaultHeatmapImageSizeH,
  );
  const [heatmapGridNumW, setHeatmapGridNumW] = useState<number>(
    defaultHeatmapGridNumW,
  );
  const [heatmapGridNumH, setHeatmapGridNumH] = useState<number>(
    defaultHeatmapGridNumH,
  );

  useEffect(() => {
    const initializeAppConfig = async () => {
      const appConfig: AppConfig = await fetchAppConfig();
      setPeopleCountBboxToPointRatio(
        appConfig.people_count_settings.bbox_to_point_ratio,
      );
      setPeopleCountInRegionsBboxToPointRatio(
        appConfig.people_count_in_regions_settings.bbox_to_point_ratio,
      );
      setHeatmapBboxToPointRatio(
        appConfig.heatmap_settings.bbox_to_point_ratio,
      );
      setHeatmapLastValidFrame(appConfig.heatmap_settings.last_valid_frame);
      setHeatmapImageSizeW(appConfig.heatmap_settings.image_size_w);
      setHeatmapImageSizeH(appConfig.heatmap_settings.image_size_h);
      setHeatmapGridNumW(appConfig.heatmap_settings.grid_num_w);
      setHeatmapGridNumH(appConfig.heatmap_settings.grid_num_h);
    };

    initializeAppConfig();
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        peopleCountBboxToPointRatio,
        setPeopleCountBboxToPointRatio,
        peopleCountInRegionsBboxToPointRatio,
        setPeopleCountInRegionsBboxToPointRatio,
        heatmapBboxToPointRatio,
        setHeatmapBboxToPointRatio,
        heatmapLastValidFrame,
        setHeatmapLastValidFrame,
        heatmapImageSizeW,
        setHeatmapImageSizeW,
        heatmapImageSizeH,
        setHeatmapImageSizeH,
        heatmapGridNumW,
        setHeatmapGridNumW,
        heatmapGridNumH,
        setHeatmapGridNumH,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfigContext(): ContextType {
  return useContext(AppConfigContext);
}
