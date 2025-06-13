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

export type Region = {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type PeopleCountSettings = {
  bbox_to_point_ratio: number;
};

export type PeopleCountInRegionSettings = {
  bbox_to_point_ratio: number;
  regions: Region[];
};

export type HeatmapSettings = {
  bbox_to_point_ratio: number;
  last_valid_frame: number;
  image_size_w: number;
  image_size_h: number;
  grid_num_w: number;
  grid_num_h: number;
};

export type AppConfig = {
  people_count_settings: PeopleCountSettings;
  people_count_in_regions_settings: PeopleCountInRegionSettings;
  heatmap_settings: HeatmapSettings;
};

const DEFAULT_APP_CONFIG: AppConfig = {
  people_count_settings: {
    bbox_to_point_ratio: 0.9,
  },
  people_count_in_regions_settings: {
    bbox_to_point_ratio: 0.9,
    regions: [
      {
        id: "region1",
        left: 0,
        top: 0,
        right: 150,
        bottom: 320,
      },
      {
        id: "region2",
        left: 170,
        top: 0,
        right: 320,
        bottom: 320,
      },
    ],
  },
  heatmap_settings: {
    bbox_to_point_ratio: 0.9,
    last_valid_frame: 600,
    image_size_w: 320,
    image_size_h: 320,
    grid_num_w: 8,
    grid_num_h: 8,
  },
};

function isValidRegionData(regions: unknown): boolean {
  if (regions === undefined || regions === null) {
    return false;
  }

  if (!Array.isArray(regions)) {
    return false;
  }

  if (regions.length === 0) {
    return false;
  }

  return regions.every((region): region is Region => {
    if (region === null || typeof region !== "object") {
      return false;
    }

    const typedRegion = region as Partial<Region>;

    return (
      typeof typedRegion.id === "string" &&
      typeof typedRegion.left === "number" &&
      typeof typedRegion.top === "number" &&
      typeof typedRegion.right === "number" &&
      typeof typedRegion.bottom === "number"
    );
  });
}

export async function fetchAppConfig(): Promise<AppConfig> {
  const url = import.meta.env.VITE_BACKEND_URL + "app_config/";

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log("fetchAppConfig response: ", json);

    const backendRegions = json?.people_count_in_regions_settings?.regions;
    const regionsValid = isValidRegionData(backendRegions);

    if (!regionsValid) {
      if (backendRegions === undefined) {
        console.error("No regions data found in backend response");
      } else {
        console.error(
          "Invalid regions data received from backend:",
          backendRegions,
        );
      }
      console.warn("Using default regions configuration");
    }

    const appConfig: AppConfig = {
      people_count_settings: {
        bbox_to_point_ratio:
          json?.people_count_settings?.bbox_to_point_ratio ??
          DEFAULT_APP_CONFIG.people_count_settings.bbox_to_point_ratio,
      },
      people_count_in_regions_settings: {
        bbox_to_point_ratio:
          json?.people_count_in_regions_settings?.bbox_to_point_ratio ??
          DEFAULT_APP_CONFIG.people_count_in_regions_settings
            .bbox_to_point_ratio,
        regions: isValidRegionData(
          json?.people_count_in_regions_settings?.regions,
        )
          ? json.people_count_in_regions_settings.regions
          : DEFAULT_APP_CONFIG.people_count_in_regions_settings.regions,
      },
      heatmap_settings: {
        bbox_to_point_ratio:
          json?.heatmap_settings?.bbox_to_point_ratio ??
          DEFAULT_APP_CONFIG.heatmap_settings.bbox_to_point_ratio,
        last_valid_frame:
          json?.heatmap_settings?.last_valid_frame ??
          DEFAULT_APP_CONFIG.heatmap_settings.last_valid_frame,
        image_size_w:
          json?.heatmap_settings?.image_size_w ??
          DEFAULT_APP_CONFIG.heatmap_settings.image_size_w,
        image_size_h:
          json?.heatmap_settings?.image_size_h ??
          DEFAULT_APP_CONFIG.heatmap_settings.image_size_h,
        grid_num_w:
          json?.heatmap_settings?.grid_num_w ??
          DEFAULT_APP_CONFIG.heatmap_settings.grid_num_w,
        grid_num_h:
          json?.heatmap_settings?.grid_num_h ??
          DEFAULT_APP_CONFIG.heatmap_settings.grid_num_h,
      },
    };
    return appConfig;
  } catch (error) {
    console.error("Error fetching app config the backend:", error);
    throw error;
  }
}

export async function sendSelectedRegions(
  selectedRegions: Region[],
): Promise<void> {
  const url = import.meta.env.VITE_BACKEND_URL + "app_config/regions";
  console.log("API call: ", url);
  try {
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ regions: selectedRegions }),
    });
    console.log({ regions: selectedRegions });
  } catch (error) {
    console.error("Error sending regions data to the backend:", error);
    throw error;
  }
}
