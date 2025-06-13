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

import Grid from "@mui/material/Grid2";
import CodeMirror from "@uiw/react-codemirror";
import { jsonLanguage } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";

import { Inference } from "../../../types/types";

interface InferenceDataProps {
  inferenceData: Inference | undefined;
}

export default function InferenceDataDisplay({
  inferenceData,
}: InferenceDataProps) {
  return (
    <Grid sx={{ textAlign: "left", width: "100%" }}>
      <CodeMirror
        height="320px"
        value={inferenceData ? JSON.stringify(inferenceData, null, 2) : ""}
        theme={githubLight}
        extensions={[jsonLanguage]}
      />
    </Grid>
  );
}
