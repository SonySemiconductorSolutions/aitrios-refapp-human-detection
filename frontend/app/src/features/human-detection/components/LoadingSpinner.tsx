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

import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import {
  isLoadingStage,
  useScreenContext,
} from "../../../stores/ScreenContext";

export default function LoadingSpinner() {
  const { screenStage } = useScreenContext();

  if (!isLoadingStage(screenStage)) {
    return null;
  }

  return (
    <Backdrop sx={{ zIndex: 1 }} open={true}>
      <CircularProgress
        sx={{ color: "white", position: "fixed", top: "50%", left: "50%" }}
      />
    </Backdrop>
  );
}
