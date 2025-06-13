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

export type Device = {
  device_id: string;
  device_name: string;
  connection_state: string;
  models?: string[];
  application?: string[];
  inference_status?: string;
};

export function connectedDevices(devices: Device[]): Device[] {
  return devices.filter((device: Device) => {
    return device.connection_state === "Connected";
  });
}

export function disconnectedDevices(devices: Device[]): Device[] {
  return devices.filter((device: Device) => {
    return device.connection_state === "Disconnected";
  });
}

/*
Calls backend to retrieve the list of devices available on Console.
*/
export async function getDeviceList(): Promise<Device[]> {
  const url = import.meta.env.VITE_BACKEND_URL + "devices/";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Error " +
        response.status +
        " getting devices information from the Console.",
    );
  }

  let deviceList = [];
  try {
    const json = await response.json();
    deviceList = json["devices"];
    deviceList.sort(function (a: Device, b: Device) {
      if (a.connection_state == b.connection_state) {
        return a.device_name.localeCompare(b.device_name);
      } else {
        if (a.connection_state == "Connected") {
          return -1;
        } else {
          return 1;
        }
      }
    });
  } catch (error) {
    console.error("Error getting devices: ", error);
    throw error;
  }
  return deviceList;
}

/*
Calls backend to retrieve specific device information: id, connection state, models and applications.
*/
export async function getDevice(deviceId: string): Promise<Device> {
  const url = import.meta.env.VITE_BACKEND_URL + "devices/" + deviceId;
  console.log("deviceId: " + deviceId + ", url: " + url);
  let device: Device = {
    device_id: deviceId,
    device_name: "",
    connection_state: "Disconnected",
  };
  if (deviceId) {
    let response = await fetch(url);
    if (response.ok) {
      device = await response.json();
    } else {
      let errormessage = await response.json();
      console.log(errormessage.detail);
      throw new Error(errormessage.detail);
    }
  } else {
    console.log("deviceId not set");
  }

  console.log("Device info: ", device);
  return device;
}
