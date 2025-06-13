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
import { defaultImageSrc } from "./constants";
import {
  Inference,
  isPeopleCountInference,
  isPeopleCountInRegionsInference,
  ObjectDetectionTop,
} from "../types/types";
import { useDeviceModelIdContext } from "./DeviceModelIdContext";

const maxQueueSize: number = 3600;

export type PeopleCountTelemetry = {
  timestamp: string;
  people_count: number;
};

export type PeopleCountInRegionsTelemetry = {
  timestamp: string;
  people_count_in_regions: { [region_id: string]: number };
};

function enqueueTelemetry<T extends { timestamp: string }>(
  newItem: T,
  setTelemetries: React.Dispatch<React.SetStateAction<T[]>>,
): void {
  setTelemetries((currentItems) => {
    const updatedItems = [...currentItems, newItem];
    return updatedItems.length > maxQueueSize
      ? updatedItems.slice(-maxQueueSize)
      : updatedItems;
  });
}

import { timeParse } from "d3-time-format";
export const dateParser = timeParse("%Y%m%d%H%M%S%L");

interface Props {
  children: ReactNode;
}

interface ImageInferenceContextType {
  dataStreamActive: boolean;
  setDataStreamActive: (value: boolean) => void;
  imageSrc: string;
  setImageSrc: (value: string) => void;
  inferenceTS: string;
  setInferenceTS: (value: string) => void;
  inferenceData: ObjectDetectionTop | null;
  setInferenceData: (value: ObjectDetectionTop) => void;
  handleReceiveDataPoint: (data: {
    inference: Inference;
    timestamp: string;
    image: string;
    deviceId: string;
  }) => void;
  peopleCountTelemetries: PeopleCountTelemetry[];
  setPeopleCountTelemetries: React.Dispatch<
    React.SetStateAction<PeopleCountTelemetry[]>
  >;
  peopleCountInRegionsTelemetries: PeopleCountInRegionsTelemetry[];
  setPeopleCountInRegionsTelemetries: React.Dispatch<
    React.SetStateAction<PeopleCountInRegionsTelemetry[]>
  >;
}

const ImageInferenceContext = createContext<ImageInferenceContextType>(
  {} as ImageInferenceContextType,
);

export function ImageInferenceContextProvider({ children }: Props) {
  const [dataStreamActive, setDataStreamActive] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(defaultImageSrc);
  const [inferenceTS, setInferenceTS] = useState<string>("");
  const [inferenceData, setInferenceData] = useState<ObjectDetectionTop | null>(
    null,
  );
  const [peopleCountTelemetries, setPeopleCountTelemetries] = useState<
    PeopleCountTelemetry[]
  >([]);
  const [peopleCountInRegionsTelemetries, setPeopleCountInRegionsTelemetries] =
    useState<PeopleCountInRegionsTelemetry[]>([]);
  const { deviceId } = useDeviceModelIdContext();

  const handleReceiveDataPoint = (data: {
    inference: Inference;
    timestamp: string;
    image: string;
    deviceId: string;
  }) => {
    if (data.deviceId != deviceId) return; // this data is from another device, do nothing
    if (!dataStreamActive) return;
    if (data.image) {
      const base64Image = data.image;
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      setImageSrc(imageSrc);
    } else {
      setImageSrc("");
    }
    setInferenceData(data.inference);
    setInferenceTS(data.timestamp);
    if (isPeopleCountInference(data.inference)) {
      enqueueTelemetry<PeopleCountTelemetry>(
        {
          timestamp: data.timestamp,
          people_count: data.inference.people_count,
        },
        setPeopleCountTelemetries,
      );
    }
    if (isPeopleCountInRegionsInference(data.inference)) {
      enqueueTelemetry<PeopleCountInRegionsTelemetry>(
        {
          timestamp: data.timestamp,
          people_count_in_regions: data.inference.people_count_in_regions,
        },
        setPeopleCountInRegionsTelemetries,
      );
    }
  };

  return (
    <ImageInferenceContext.Provider
      value={{
        dataStreamActive,
        setDataStreamActive,
        imageSrc,
        setImageSrc,
        inferenceTS,
        setInferenceTS,
        inferenceData,
        setInferenceData,
        handleReceiveDataPoint,
        peopleCountTelemetries,
        setPeopleCountTelemetries,
        peopleCountInRegionsTelemetries,
        setPeopleCountInRegionsTelemetries,
      }}
    >
      {children}
    </ImageInferenceContext.Provider>
  );
}

export function useImageInferenceContext(): ImageInferenceContextType {
  return useContext(ImageInferenceContext);
}
