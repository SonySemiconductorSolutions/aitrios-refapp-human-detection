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

import ruamel.yaml
import yaml

logger = logging.getLogger(__name__)

APP_CONFIG_FILE = os.getenv(
    "APP_CONFIG",
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "app_config.yaml",
    ),
)


def update_app_config_from_yaml(key_path: list[str], value: any):
    """Update a specific key in the YAML configuration file based on a key path."""
    try:
        if not key_path:
            raise ValueError("Empty key path")

        logger.debug(f"Updating key path {key_path} in {APP_CONFIG_FILE}")
        app_config = load_app_config_from_yaml()

        # Traverse the nested structure to find the target key
        current = app_config
        for key in key_path[:-1]:
            if not isinstance(current, dict):
                raise ValueError(
                    f"Cannot navigate through {type(current).__name__} at path {key_path}"
                )
            current = current[key]
        current[key_path[-1]] = value

        # Using Ruamel.yaml to preserve comments in YAML files
        with open(APP_CONFIG_FILE, "w") as file:
            ruamel.yaml.YAML().dump(app_config, file)
        logger.info(f"Successfully updated {key_path} in YAML file.")
    except Exception as e:
        logger.error(
            f"Error updating {key_path} in {APP_CONFIG_FILE}: {e}", exc_info=True
        )
        raise Exception(f"Failed to update config: {str(e)}")


def update_regions_in_app_config(regions_settings: dict):
    """Update the regions settings in the YAML file."""
    update_app_config_from_yaml(
        ["people_count_in_regions_settings", "regions"], regions_settings["regions"]
    )


def load_app_config_from_yaml() -> dict:
    """Load app config from the YAML file."""
    try:
        logger.debug(f"Attempting to load settings from {APP_CONFIG_FILE}")
        if not os.path.isfile(APP_CONFIG_FILE):
            logger.warning(f"Settings file {APP_CONFIG_FILE} not found.")
            raise FileNotFoundError("Settings file not found.")

        with open(APP_CONFIG_FILE) as file:
            settings = yaml.safe_load(file)
            logger.info("Settings successfully loaded from YAML file.")
            return settings
    except Exception as e:
        logger.error(
            f"Failed to load settings from {APP_CONFIG_FILE}: {e}", exc_info=True
        )
        raise Exception(f"Failed to load settings: {str(e)}")
