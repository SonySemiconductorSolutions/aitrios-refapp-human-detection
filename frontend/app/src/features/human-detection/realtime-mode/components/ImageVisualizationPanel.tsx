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

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Canvas from "../../components/Canvas";
import InferenceDataDisplay from "../../components/InferenceDataDisplay";
import { useImageInferenceContext } from "../../../../stores/ImageInferenceContext";
import { formatTimestampToDateTime } from "../../utils/dateTimeFormatters";
import SolutionTab from "../../components/SolutionTab";
import BBoxHumanoidTab from "../../components/BBoxHumanoidTab";
import DownloadButton from "../../components/DownloadButton";
import CopyButton from "../../components/CopyButton";

export default function ImageVisualizationPanel() {
  const { inferenceTS, imageSrc, inferenceData } = useImageInferenceContext();
  const [showHumanoid, setShowHumanoid] = useState<boolean>(false);

  const handleClickDownloadImage = () => {
    if (!imageSrc) {
      alert("No image available for download.");
      return;
    }
    const fileName = inferenceTS + ".jpeg";
    const decodedFile = atob(imageSrc.replace(/^.*,/, ""));
    const buffer = new Uint8Array(decodedFile.length).map((_, x) =>
      decodedFile.charCodeAt(x),
    );
    const data = new Blob([buffer.buffer], { type: "image/jpeg" });
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute("download", fileName);
    link.click();
    document.body.removeChild(link);
  };

  const handleClickCopyInferenceData = async () => {
    if (inferenceData) {
      await navigator.clipboard.writeText(
        JSON.stringify(inferenceData, null, 2),
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
              {formatTimestampToDateTime(inferenceTS)}
            </Typography>
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
              imageSrc={imageSrc}
              inferenceData={inferenceData || undefined}
              showHumanoid={showHumanoid}
            />
            <DownloadButton onClick={handleClickDownloadImage} />
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <InferenceDataDisplay inferenceData={inferenceData || undefined} />
            <CopyButton onClick={handleClickCopyInferenceData} />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
