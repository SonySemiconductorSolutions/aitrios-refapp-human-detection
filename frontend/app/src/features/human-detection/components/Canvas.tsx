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

import { useEffect, useRef, useState, MouseEvent } from "react";
import { useRegionContext } from "../../../stores/RegionContext";
import { useScreenContext } from "../../../stores/ScreenContext";
import {
  isHeatmap,
  isPeopleCountInRegions,
  useAppContext,
} from "../../../stores/AppContext";
import { useAppConfigContext } from "../../../stores/AppConfigContext";
import { Inference, isHeatmapInference } from "../../../types/types";

interface CanvasProps {
  imageSrc: string;
  inferenceData: Inference | undefined;
  showHumanoid: boolean;
}

export default function Canvas({
  imageSrc,
  inferenceData,
  showHumanoid,
}: CanvasProps) {
  const background = useRef<HTMLImageElement>(new Image()).current;
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const contextReference = useRef<CanvasRenderingContext2D | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const { canvasWidth, canvasHeight } = useScreenContext();
  const {
    enableRegionIds,
    selectedRegionId,
    dragStartPoint,
    setDragStartPoint,
    dragEndPoint,
    setDragEndPoint,
    selectedRegions,
  } = useRegionContext();
  const { solutionType, appState } = useAppContext();
  const { heatmapLastValidFrame, heatmapBboxToPointRatio } =
    useAppConfigContext();

  const editable = selectedRegionId !== null;

  function drawHumanoid(context: CanvasRenderingContext2D) {
    context.save();

    const style = {
      line: { width: 1.5, color: "red" },
      fill: { color: "rgba(178, 34, 34, 0.3)" },
      gap: 3,
      headToBodyRatio: 5,
    };

    if (inferenceData?.perception?.object_detection_list) {
      inferenceData.perception.object_detection_list.forEach((det) => {
        const bbox = det.bounding_box;
        const width = bbox.right - bbox.left;
        const height = bbox.bottom - bbox.top;

        const headRatio = (1 - heatmapBboxToPointRatio) * 2;
        const headHeight = height * headRatio;

        const head = {
          height: headHeight,
          width: headHeight,
          centerX: bbox.left + width / 2,
          centerY: bbox.top + headHeight / 2,
          bottom: bbox.top + headHeight,
          radius: { x: headHeight / 2, y: headHeight / 2 },
        };

        const body = {
          top: head.bottom + style.gap,
          height: style.headToBodyRatio * head.height - style.gap,
          shoulderWidth: head.width * 2,
          hipWidth: head.width,
        };

        // Draw head
        context.beginPath();
        context.ellipse(
          head.centerX,
          head.centerY,
          head.radius.x,
          head.radius.y,
          0,
          0,
          Math.PI * 2,
        );
        context.fillStyle = style.fill.color;
        context.fill();
        context.strokeStyle = style.line.color;
        context.lineWidth = style.line.width;
        context.stroke();

        // Draw body
        context.beginPath();
        context.moveTo(head.centerX - body.shoulderWidth / 2, body.top);
        context.lineTo(head.centerX + body.shoulderWidth / 2, body.top);
        context.lineTo(
          head.centerX + body.hipWidth / 2,
          body.top + body.height,
        );
        context.lineTo(
          head.centerX - body.hipWidth / 2,
          body.top + body.height,
        );
        context.closePath();
        context.fillStyle = style.fill.color;
        context.fill();
        context.strokeStyle = style.line.color;
        context.lineWidth = style.line.width;
        context.stroke();
      });
    }

    context.restore();
  }

  function drawHeatmap(context: CanvasRenderingContext2D) {
    if (!isHeatmapInference(inferenceData)) return;

    const rows = inferenceData.heatmap.length;
    const cols = inferenceData.heatmap[0].length;

    const cellWidth = canvasWidth / cols;
    const cellHeight = canvasHeight / rows;

    const drawCell = (
      rowIndex: number,
      colIndex: number,
      value: number,
    ): void => {
      if (value === 0) return;

      const intensity = Math.min(value / heatmapLastValidFrame, 1.0);
      const alpha = 0.4;

      const r = 255;
      const g = Math.round(200 - 200 * intensity);
      const b = Math.round(200 - 200 * intensity);

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

      const x = colIndex * cellWidth;
      const y = rowIndex * cellHeight;
      context.fillRect(x, y, cellWidth, cellHeight);
    };

    context.save();
    inferenceData.heatmap.forEach((row: number[], i: number) => {
      row.forEach((value: number, j: number) => {
        drawCell(i, j, value);
      });
    });
    context.restore();
  }

  function drawZones(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = "rgba(255, 82, 0, 0.3)";
    //context.fillStyle = "rgba(0, 120, 255, 0.3)";
    enableRegionIds.forEach((enableId) => {
      const region = selectedRegions.find((region) => region.id === enableId);
      if (region) {
        const { left, top, right, bottom } = region;
        context.fillRect(left, top, right - left, bottom - top);
      }
    });
    context.restore();
  }

  function drawDragZone(context: CanvasRenderingContext2D) {
    context.save();
    context.beginPath();
    context.lineWidth = 2;
    context.setLineDash([7, 2]);
    context.strokeStyle = "rgba(255, 82, 0, 0.4)";
    context.strokeRect(
      dragStartPoint.x,
      dragStartPoint.y,
      dragEndPoint.x - dragStartPoint.x,
      dragEndPoint.y - dragStartPoint.y,
    );
    context.restore();
  }

  function drawInactiveZones(context: CanvasRenderingContext2D) {
    context.save();
    context.beginPath();
    context.lineWidth = 2;
    context.setLineDash([]);
    context.strokeStyle = "rgba(255, 82, 0, 0.4)";

    enableRegionIds.forEach((enableId) => {
      const region = selectedRegions.find(
        (region) => region.id === enableId && region.id !== selectedRegionId,
      );
      if (region) {
        const { left, top, right, bottom } = region;
        context.strokeRect(left, top, right - left, bottom - top);
      }
    });
    context.restore();
  }

  function drawBoundingBoxes(context: CanvasRenderingContext2D) {
    context.save();
    if (inferenceData?.perception?.object_detection_list) {
      inferenceData.perception.object_detection_list.forEach((det) => {
        const { left, top, right, bottom } = det.bounding_box;
        // context.strokeStyle = det.zone_flag ? "green" : "red";
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(left, top, right - left, bottom - top);
      });
    }
    context.restore();
  }

  function handleMouseDown(e: MouseEvent) {
    resetCanvas();
    setDragStartPoint({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    setDragEndPoint({ x: NaN, y: NaN });
    setIsPressed(true);
  }

  function handleMouseUp(_e: MouseEvent) {
    if (!isPressed) return;
    const context: CanvasRenderingContext2D = contextReference.current!;
    setIsPressed(false);
    resetCanvas();
    if (isPeopleCountInRegions(solutionType)) {
      drawDragZone(context);
      drawInactiveZones(context);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isPressed) return;
    const context: CanvasRenderingContext2D = contextReference.current!;
    setDragEndPoint({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    resetCanvas();
    if (isPeopleCountInRegions(solutionType)) {
      drawDragZone(context);
      drawInactiveZones(context);
    }
  }

  function handleMouseLeave(_e: MouseEvent) {
    if (!isPressed) return;
    const context: CanvasRenderingContext2D = contextReference.current!;
    setIsPressed(false);
    resetCanvas();
    if (isPeopleCountInRegions(solutionType)) {
      drawDragZone(context);
      drawInactiveZones(context);
    }
  }

  function resetCanvas() {
    const canvas: HTMLCanvasElement = canvasReference.current!;
    const context: CanvasRenderingContext2D = contextReference.current!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (imageSrc) {
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
  }

  function drawImageAndCanvas(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    background.src = imageSrc;
    background.onload = () => {
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      drawCanvas(context);
    };
  }

  function drawCanvas(context: CanvasRenderingContext2D) {
    if (showHumanoid) {
      drawHumanoid(context);
    } else {
      drawBoundingBoxes(context);
    }
    if (isPeopleCountInRegions(solutionType)) {
      drawZones(context);
    }
    if (isHeatmap(solutionType)) {
      drawHeatmap(context);
    }
  }

  function updateCanvas() {
    if (canvasReference.current == null) {
      console.log(inferenceData);
      return;
    }

    const canvas: HTMLCanvasElement = canvasReference.current!;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    contextReference.current = context;

    resetCanvas();

    if (imageSrc !== "") {
      drawImageAndCanvas(canvas, context);
    } else {
      drawCanvas(context);
    }
  }

  useEffect(() => {
    updateCanvas();
  }, [
    imageSrc,
    inferenceData,
    selectedRegionId,
    showHumanoid,
    solutionType,
    appState,
  ]);

  return (
    <canvas
      height={canvasWidth}
      width={canvasHeight}
      ref={canvasReference}
      onMouseDown={editable ? handleMouseDown : undefined}
      onMouseMove={editable ? handleMouseMove : undefined}
      onMouseUp={editable ? handleMouseUp : undefined}
      onMouseLeave={editable ? handleMouseLeave : undefined}
    />
  );
}
