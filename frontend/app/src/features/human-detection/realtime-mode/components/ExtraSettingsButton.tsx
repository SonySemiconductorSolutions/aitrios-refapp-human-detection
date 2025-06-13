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

import SettingsIcon from "@mui/icons-material/Settings";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { useScreenContext } from "../../../../stores/ScreenContext";

export default function ExtraSettingsButton({
  disabled,
}: {
  disabled: boolean;
}) {
  const { screenStage, setScreenStage } = useScreenContext();

  const handleClick = () => {
    if (screenStage === "extra_parameter_selection") {
      setScreenStage("parameter_selection");
    } else {
      setScreenStage("extra_parameter_selection");
    }
  };

  const toolTipTitle =
    screenStage === "extra_parameter_selection"
      ? "Cancel - discard modifications"
      : "Modify configuration in text editor";

  return (
    <Tooltip title={toolTipTitle}>
      <span>
        <Button
          variant="contained"
          onClick={handleClick}
          style={{ fontSize: "10px" }}
          sx={{ width: "10%", float: "right", alignLeft: "auto" }}
          disabled={disabled}
        >
          {screenStage === "extra_parameter_selection" ? (
            <CancelIcon />
          ) : (
            <SettingsIcon />
          )}
        </Button>
      </span>
    </Tooltip>
  );
}
