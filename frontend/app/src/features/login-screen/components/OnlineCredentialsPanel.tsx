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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputTextField from "./InputTextField";
import InputPasswordField from "./InputPasswordField";
import {
  getConsoleConfigurations,
  putConsoleConfigurations,
  ConsoleSettings,
} from "../utils/ConsoleConfiguration";
import { useAppContext, ConsoleType } from "../../../stores/AppContext";
import { useScreenContext } from "../../../stores/ScreenContext";
import { getDeviceList } from "../../../utils/DeviceInfoFromConsole";
import { useDeviceModelIdContext } from "../../../stores/DeviceModelIdContext";

type OnlineCredentialsPanelProps = {
  consoleType: ConsoleType;
};

function versionsAreCompatible(
  version_url: String,
  version_console_type: String,
): boolean {
  var compatible: boolean =
    (version_url == "v2" && version_console_type == "ONLINE V2") ||
    (version_url == "v1" && version_console_type == "ONLINE V1");
  return compatible;
}

export default function OnlineCredentialsPanel({
  consoleType,
}: OnlineCredentialsPanelProps) {
  const { setAppState, setDeviceList, setCredentialsState } = useAppContext();
  const { setScreenStage } = useScreenContext();
  const { setDeviceId } = useDeviceModelIdContext();

  const [consoleEndpoint, setConsoleEndpoint] = useState<string>("");
  const [authorizationEndpoint, setAuthorizationEndpoint] =
    useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [credentialError, setCredentialError] = useState<boolean>(false);

  const consoleTypeLabel: string =
    consoleType == "ONLINE V1" ? "Online Console v1" : "Online Console v2";

  const moveToMainScreen = () => {
    console.log("Set new screen value");
    setCredentialsState("validated");
    setScreenStage("initial");
    setAppState("realtime_screen");
    setCredentialError(false);
    setDeviceId("");
  };

  const setSignedOutScreen = () => {
    setCredentialError(true);
    setCredentialsState("erroneous");
    console.log("Configuration parameters not set");
  };

  const handleSetCredentials = async () => {
    var version_from_url = consoleEndpoint.substring(
      consoleEndpoint.length - 2,
    );
    if (!versionsAreCompatible(version_from_url, consoleType)) {
      setSignedOutScreen();
      if (version_from_url == "v1" || version_from_url == "v2") {
        alert(
          "Version mismatch: consoleEndpoint version is " +
            version_from_url +
            ", but " +
            consoleTypeLabel +
            " is selected!",
        );
      } else {
        alert("Console endpoint should end with v1 or v2!");
      }
      console.log("setSignedOutScreen");
      return;
    }
    await putConsoleConfigurations({
      console_endpoint: consoleEndpoint,
      portal_authorization_endpoint: authorizationEndpoint,
      client_id: clientId,
      client_secret: clientSecret,
    })
      .then(() => {
        return getDeviceList();
      })
      .then((res) => {
        localStorage.setItem("console_endpoint", consoleEndpoint);
        localStorage.setItem(
          "portal_authorization_endpoint",
          authorizationEndpoint,
        );
        localStorage.setItem("client_id", clientId);
        localStorage.setItem("client_secret", clientSecret);
        setDeviceList(res);
        moveToMainScreen();
      })
      .catch(() => {
        setSignedOutScreen();
        console.log("setSignedOutScreen");
      });
    return;
  };

  useEffect(() => {
    getConsoleConfigurations().then(async (res: ConsoleSettings) => {
      setConsoleEndpoint(res.console_endpoint);
      setAuthorizationEndpoint(res.portal_authorization_endpoint);
      setClientId(res.client_id);
      setClientSecret(res.client_secret);
    });
  }, []);

  return (
    <Box flexGrow={1} sx={{ mt: 5, minWidth: "clamp(200px, 40vw, 1000px)" }}>
      <Card variant="outlined" sx={{ padding: 1.2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {consoleTypeLabel} Configuration
        </Typography>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          m={1}
          spacing={1}
        >
          <Typography fontWeight="bold">Console endpoint</Typography>
          <InputTextField
            variableValue={consoleEndpoint}
            setVariableValue={setConsoleEndpoint}
            error={credentialError}
          />
          <Typography fontWeight="bold">
            Portal authorization endpoint
          </Typography>
          <InputTextField
            variableValue={authorizationEndpoint}
            setVariableValue={setAuthorizationEndpoint}
            error={credentialError}
          />
          <Typography fontWeight="bold">Client ID</Typography>
          <InputTextField
            variableValue={clientId}
            setVariableValue={setClientId}
            error={credentialError}
          />
          <Typography fontWeight="bold">Client Secret</Typography>
          <InputPasswordField
            variableValue={clientSecret}
            setVariableValue={setClientSecret}
            error={credentialError}
          />
          <Button
            variant="contained"
            onClick={handleSetCredentials}
            style={{ width: "100%" }}
            sx={{ mt: 10 }}
            children={"Set Credentials"}
          />
        </Stack>
      </Card>
    </Box>
  );
}
