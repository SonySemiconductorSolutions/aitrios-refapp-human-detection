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

import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Canvas from "../../components/Canvas";
import InferenceDataDisplay from "../../components/InferenceDataDisplay";
import SolutionTab from "../../components/SolutionTab";
import BBoxHumanoidTab from "../../components/BBoxHumanoidTab";
import DownloadButton from "../../components/DownloadButton";
import CopyButton from "../../components/CopyButton";
import { formatTimestampToDateTime } from "../../utils/dateTimeFormatters";
import {
  isHistoryScreenActive,
  useAppContext,
} from "../../../../stores/AppContext";
import { useHistoryDataContext } from "../../../../stores/HistoryDataContext";
import { useInterval } from "../../../../hooks/CustomHooks";
import { hasImage } from "../../../../types/types";

export default function ImageVisualizationPanel() {
  const { solutionType, appState, consoleType } = useAppContext();
  const { historyData } = useHistoryDataContext();
  const { isPlaybackActive } = useHistoryDataContext();
  const [showHumanoid, setShowHumanoid] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaybackRunning, setIsPlaybackRunning] = useState(false);

  const updateIndexInterval = 1000;

  const HistorySnapShotData =
    currentIndex >= 0 && currentIndex < historyData.data.length
      ? historyData.data[currentIndex]
      : null;

  useEffect(() => {
    if (isPlaybackActive) {
      setIsPlaybackRunning(true);
    } else {
      setIsPlaybackRunning(false);
      setCurrentIndex(0);
    }
  }, [isPlaybackActive, solutionType, appState]);

  function updateIndexWithInterval() {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= historyData.data.length) {
        setIsPlaybackRunning(false);
        return prev;
      }
      return nextIndex;
    });
  }

  // Manage playback interval based on playback state and conditions
  useInterval(
    updateIndexWithInterval,
    isHistoryScreenActive(appState) && isPlaybackActive && isPlaybackRunning
      ? updateIndexInterval
      : null, // Stop interval if conditions are not met
  );

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaybackRunning) {
        if (event.key === "ArrowLeft") {
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === "ArrowRight") {
          setCurrentIndex((prev) =>
            Math.min(prev + 1, historyData.data.length - 1),
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaybackRunning, historyData.data.length]);

  const togglePlayback = () => {
    setIsPlaybackRunning((prev) => !prev);
  };

  const handlePrevious = () => {
    if (isPlaybackRunning) {
      setIsPlaybackRunning(false);
    }
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (isPlaybackRunning) {
      setIsPlaybackRunning(false);
    }
    setCurrentIndex((prev) => Math.min(prev + 1, historyData.data.length - 1));
  };

  const handleSasUrlDownload = (link: HTMLAnchorElement, imageSrc: string) => {
    link.href = imageSrc;
    link.click();
  };

  const handleBase64Download = (
    link: HTMLAnchorElement,
    fileName: string,
    imageSrc: string,
  ) => {
    try {
      const base64Image = imageSrc.replace(/^.*,/, "");
      const decodedFile = atob(base64Image);
      const buffer = new Uint8Array(decodedFile.length).map((_, x) =>
        decodedFile.charCodeAt(x),
      );
      const data = new Blob([buffer.buffer], { type: "image/jpeg" });
      link.href = window.URL.createObjectURL(data);
      link.setAttribute("download", fileName);
      link.click();
    } catch (error) {
      console.error("Failed to decode Base64 image:", error);
      alert("Failed to download the image. The image data may be corrupted.");
    }
  };

  const handleClickDownloadImage = () => {
    if (!hasImage(HistorySnapShotData)) {
      alert("No image available for download.");
      return;
    }

    const fileName = HistorySnapShotData?.timestamp
      ? `${HistorySnapShotData.timestamp}.jpeg`
      : "default.jpeg";

    const link = document.createElement("a");
    document.body.appendChild(link);
    console.log("consoleType", consoleType);

    if (consoleType === "ONLINE V2") {
      handleSasUrlDownload(link, HistorySnapShotData.image);
    } else if (consoleType === "ONLINE V1") {
      handleBase64Download(link, fileName, HistorySnapShotData.image);
    } else {
      throw new Error("Invalid console type");
    }
    document.body.removeChild(link);
  };

  const handleClickCopyInferenceData = async () => {
    if (HistorySnapShotData?.inference) {
      await navigator.clipboard.writeText(
        JSON.stringify(HistorySnapShotData?.inference, null, 2),
      );
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "32px",
          }}
        >
          <SolutionTab />
        </Box>

        <Box display={"flex"} justifyContent={"space-between"}>
          <Stack>
            <Typography align="left">Timestamp</Typography>
            <Typography align="left" sx={{ whiteSpace: "nowrap" }}>
              {formatTimestampToDateTime(HistorySnapShotData?.timestamp || "")}
            </Typography>
          </Stack>
          <Stack>
            <Typography>Index</Typography>
            {historyData.data.length > 0 ? (
              <Typography>
                {currentIndex + 1}/{historyData.data.length}
              </Typography>
            ) : (
              <Typography>-</Typography>
            )}
          </Stack>
          <BBoxHumanoidTab
            showHumanoid={showHumanoid}
            setShowHumanoid={setShowHumanoid}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Stack>
            <Canvas
              imageSrc={
                hasImage(HistorySnapShotData) ? HistorySnapShotData.image : ""
              }
              inferenceData={HistorySnapShotData?.inference}
              showHumanoid={showHumanoid}
            />
            <DownloadButton onClick={handleClickDownloadImage} />
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <InferenceDataDisplay
              inferenceData={HistorySnapShotData?.inference}
            />
            <CopyButton onClick={handleClickCopyInferenceData} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={!isPlaybackActive || currentIndex === 0}
          >
            <ArrowBackIosNewIcon />
          </Button>
          <Button
            variant="contained"
            onClick={togglePlayback}
            disabled={!isPlaybackActive}
          >
            {isPlaybackRunning ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              !isPlaybackActive || currentIndex === historyData.data.length - 1
            }
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
