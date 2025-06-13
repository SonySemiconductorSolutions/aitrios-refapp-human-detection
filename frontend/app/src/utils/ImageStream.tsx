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

import { ObjectDetectionTop } from "../types/types";

export type WebSocketState = {
  connected: boolean;
  error: string | null;
};

export type ImageData = {
  src: string;
};

const WEBSOCKET_URL = import.meta.env.VITE_BACKEND_URL + "processing/ws";

export function onMessageFunctionConstructor(
  handleReceiveDataPoint: (data: {
    inference: ObjectDetectionTop;
    timestamp: string;
    image: string;
    deviceId: string;
  }) => void,
): (event: MessageEvent) => void {
  function onMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data);
    handleReceiveDataPoint(data);
  }
  return onMessage;
}

export function connectToImageStream(
  handleReceiveDataPoint: (data: {
    inference: ObjectDetectionTop;
    timestamp: string;
    image: string;
    deviceId: string;
  }) => void,
): () => void {
  const socket = new WebSocket(WEBSOCKET_URL);
  socket.onopen = () => {};
  socket.onmessage = onMessageFunctionConstructor(handleReceiveDataPoint);
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  socket.onclose = () => {};
  return () => {
    socket.close();
  };
}
