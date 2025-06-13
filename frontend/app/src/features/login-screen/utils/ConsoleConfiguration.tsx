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

export type ConsoleSettings = {
  console_endpoint: string;
  portal_authorization_endpoint: string;
  client_id: string;
  client_secret: string;
};

export async function getConsoleConfigurations(): Promise<ConsoleSettings> {
  const url = import.meta.env.VITE_BACKEND_URL + "connection/";
  let response = await fetch(url);
  let console_settings_json = {
    console_endpoint: "no_console_endpoint",
    portal_authorization_endpoint: "no_portal_authorization_endpoint",
    client_id: "no_client_id",
    client_secret: "no_client_secret",
  };
  try {
    const json = await response.json();
    console.log("getConsoleConfigurations response: ", json);
    console_settings_json = {
      console_endpoint: json.hasOwnProperty("console_endpoint")
        ? json["console_endpoint"]
        : "no_console_endpoint",
      portal_authorization_endpoint: json.hasOwnProperty(
        "portal_authorization_endpoint",
      )
        ? json["portal_authorization_endpoint"]
        : "no_portal_authorization_endpoint",
      client_id: json.hasOwnProperty("client_id")
        ? json["client_id"]
        : "no_client_id",
      client_secret: json.hasOwnProperty("client_secret")
        ? json["client_secret"]
        : "no_client_secret",
    };
    if (
      console_settings_json.console_endpoint == "no_console_endpoint" ||
      console_settings_json.console_endpoint == "__base_url__"
    ) {
      const console_endpoint = localStorage.getItem("console_endpoint");
      if (console_endpoint) {
        console_settings_json.console_endpoint = console_endpoint;
      }
    }
    if (
      console_settings_json.portal_authorization_endpoint ==
        "no_portal_authorization_endpoint" ||
      console_settings_json.portal_authorization_endpoint == "__token_url__"
    ) {
      const portal_authorization_endpoint = localStorage.getItem(
        "portal_authorization_endpoint",
      );
      if (portal_authorization_endpoint) {
        console_settings_json.portal_authorization_endpoint =
          portal_authorization_endpoint;
      }
    }
    if (
      console_settings_json.client_id == "no_client_id" ||
      console_settings_json.client_id == "__client_id__"
    ) {
      const client_id = localStorage.getItem("client_id");
      if (client_id) {
        console_settings_json.client_id = client_id;
      }
    }
    if (
      console_settings_json.client_secret == "no_client_secret" ||
      console_settings_json.client_secret == "__client_secret__"
    ) {
      const client_secret = localStorage.getItem("client_secret");
      if (client_secret) {
        console_settings_json.client_secret = client_secret;
      }
    }
  } catch {
    const console_endpoint = localStorage.getItem("console_endpoint");
    const portal_authorization_endpoint = localStorage.getItem(
      "portal_authorization_endpoint",
    );
    const client_id = localStorage.getItem("client_id");
    const client_secret = localStorage.getItem("client_secret");
    if (
      console_endpoint &&
      portal_authorization_endpoint &&
      client_id &&
      client_secret
    ) {
      console_settings_json = {
        console_endpoint: console_endpoint,
        portal_authorization_endpoint: portal_authorization_endpoint,
        client_id: client_id,
        client_secret: client_secret,
      };
    } else {
      throw new Error("Error getting device information from the Console.");
    }
  }
  return console_settings_json;
}

export async function putConsoleConfigurations(
  consoleSettings: ConsoleSettings,
): Promise<string> {
  const url = import.meta.env.VITE_BACKEND_URL + "connection/";
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consoleSettings),
  };
  let response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error("Failed to put console connection configurations");
  }
  return await response.json();
}

export async function putConsoleType(console_type: string): Promise<string> {
  const url = import.meta.env.VITE_BACKEND_URL + "client/";
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_type: console_type }),
  };
  let response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error("Failed to set console client type");
  }
  return await response.json();
}
