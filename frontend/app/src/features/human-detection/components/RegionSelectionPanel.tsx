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

import { ReactElement } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import CropFreeIcon from "@mui/icons-material/CropFree";
import {
  isInferenceStages,
  isInitialStages,
  useScreenContext,
} from "../../../stores/ScreenContext";
import { useRegionContext } from "../../../stores/RegionContext";
import CoordinateTable from "../../../components/CoordinateTable";
import OutlinedButton from "../../../components/OutlinedButton";
import { sendSelectedRegions } from "../../../utils/AppConfig";
import { Point, Region } from "../../../types/types";

interface ButtonProps {
  innerText: ReactElement;
  disabled: boolean;
  onClick: () => void;
}

interface RegionSelectionItemProps {
  firstRowTitle: string;
  secondRowTitle: string;
  startPoint: Point;
  endPoint: Point;
  buttonProps: ButtonProps;
}

function RegionSelectionItem({
  firstRowTitle,
  secondRowTitle,
  startPoint,
  endPoint,
  buttonProps,
}: RegionSelectionItemProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={8} key="zoneDescription">
        <CoordinateTable
          firstRowTitle={firstRowTitle}
          secondRowTitle={secondRowTitle}
          startPoint={startPoint}
          endPoint={endPoint}
        />
      </Grid>

      <Grid size={4} key="zoneDetectionButton">
        <OutlinedButton
          children={buttonProps.innerText}
          disabled={buttonProps.disabled}
          onClick={buttonProps.onClick}
        />
      </Grid>
    </Grid>
  );
}

export default function RegionSelectionPanel() {
  const { screenStage, setScreenStage } = useScreenContext();
  const {
    enableRegionIds,
    selectedRegionId,
    setSelectedRegionId,
    dragStartPoint,
    dragEndPoint,
    selectedRegions,
    setSelectedRegions,
    updateSelectedRegions,
  } = useRegionContext();

  const disableParameterChange: boolean =
    isInferenceStages(screenStage) ||
    isInitialStages(screenStage) ||
    screenStage === "parameter_loading";

  const getRegionProps = (regionId: string) => {
    const isSelected = selectedRegionId === regionId;

    const selectedRegion = selectedRegions.find(
      (region) => region.id === regionId,
    );

    const startPoint = isSelected
      ? dragStartPoint
      : { x: selectedRegion?.left ?? 0, y: selectedRegion?.top ?? 0 };

    const endPoint = isSelected
      ? dragEndPoint
      : { x: selectedRegion?.right ?? 0, y: selectedRegion?.bottom ?? 0 };

    const button_props = isSelected
      ? {
          innerText: (
            <div>
              <Typography variant="body2">Accept {regionId}</Typography>
            </div>
          ),
          disabled: false,
          onClick: () => {
            const left = Math.min(dragStartPoint.x, dragEndPoint.x);
            const right = Math.max(dragStartPoint.x, dragEndPoint.x);
            const top = Math.min(dragStartPoint.y, dragEndPoint.y);
            const bottom = Math.max(dragStartPoint.y, dragEndPoint.y);

            setScreenStage("parameter_selection");
            const updated: Region = {
              id: regionId,
              left,
              top,
              right,
              bottom,
            };
            const updatedRegions = updateSelectedRegions(
              [...selectedRegions],
              updated,
            );
            setSelectedRegions(updatedRegions);
            sendSelectedRegions(updatedRegions);
            setSelectedRegionId(null);
          },
        }
      : {
          innerText: (
            <Stack direction="row" spacing={1} alignItems="center">
              <CropFreeIcon fontSize="large" />
              <Typography variant="body2">Select {regionId}</Typography>
            </Stack>
          ),
          disabled: disableParameterChange,
          onClick: () => {
            setScreenStage("zone_selection");
            setSelectedRegionId(regionId);
          },
        };

    return {
      firstRowTitle: isSelected ? "Start Point" : "Top Left",
      secondRowTitle: isSelected ? "End Point" : "Bottom Right",
      startPoint,
      endPoint,
      buttonProps: button_props,
    };
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction="column" spacing={2}>
        {enableRegionIds.map((regionId) => {
          const props = getRegionProps(regionId);

          return (
            <RegionSelectionItem
              key={regionId}
              firstRowTitle={props.firstRowTitle}
              secondRowTitle={props.secondRowTitle}
              startPoint={props.startPoint}
              endPoint={props.endPoint}
              buttonProps={props.buttonProps}
            />
          );
        })}
      </Stack>
    </Card>
  );
}
