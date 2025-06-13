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

import {
  useAppContext,
  isLoginScreenActive,
  isHistoryScreenActive,
} from "../stores/AppContext";
import LogInScreen from "./login-screen/LogInScreen";
import HistoryScreen from "./human-detection/history-mode/HistoryScreen";
import RealtimeScreen from "./human-detection/realtime-mode/RealtimeScreen";

function PrincipalScreen() {
  const { appState } = useAppContext();

  return (
    <>
      {isLoginScreenActive(appState) ? (
        <LogInScreen />
      ) : isHistoryScreenActive(appState) ? (
        <HistoryScreen />
      ) : (
        <RealtimeScreen />
      )}
    </>
  );
}

export default PrincipalScreen;
