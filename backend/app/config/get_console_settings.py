# Copyright 2025 Sony Semiconductor Solutions Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
import logging
import os

import yaml

logger = logging.getLogger(__name__)

SETTINGS_FILE = os.getenv(
    "ONLINE_ACCESS_CONFIG",
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "console_access_settings.yaml",
    ),
)


def save_settings_to_yaml(settings: dict):
    """Save settings to the YAML file."""
    try:
        logger.debug(f"Attempting to save settings to {SETTINGS_FILE}")
        with open(SETTINGS_FILE, "w") as file:
            yaml.safe_dump({"console_access_settings": settings}, file, sort_keys=False)
        logger.info("Settings successfully saved to YAML file.")
    except Exception as e:
        logger.error(f"Failed to save settings to {SETTINGS_FILE}: {e}", exc_info=True)
        raise Exception(f"Failed to save settings: {str(e)}")


def load_settings_from_yaml() -> dict:
    """Load settings from the YAML file."""
    try:
        logger.debug(f"Attempting to load settings from {SETTINGS_FILE}")
        if not os.path.isfile(SETTINGS_FILE):
            logger.warning(f"Settings file {SETTINGS_FILE} not found.")
            raise FileNotFoundError("Settings file not found.")

        with open(SETTINGS_FILE) as file:
            settings = yaml.safe_load(file).get("console_access_settings", {})
            logger.info("Settings successfully loaded from YAML file.")
            return settings
    except Exception as e:
        logger.error(
            f"Failed to load settings from {SETTINGS_FILE}: {e}", exc_info=True
        )
        raise Exception(f"Failed to load settings: {str(e)}")


def get_console_settings() -> tuple[str, str, str, str]:
    logger.debug("Fetching console settings.")
    settings = load_settings_from_yaml()
    if not settings:
        logger.error("Settings file is empty or not initialized.")
        raise ValueError("Settings file is empty or not initialized.")

    logger.info("Console settings successfully retrieved.")
    return (
        settings["console_endpoint"],
        settings["client_id"],
        settings["client_secret"],
        settings["portal_authorization_endpoint"],
    )
