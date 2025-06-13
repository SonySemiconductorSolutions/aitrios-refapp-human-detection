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
import logging.config
import os

LOG_FORMAT = (
    "%(asctime)s | %(levelname)s | %(name)s | %(filename)s:%(lineno)d | %(message)s"
)
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()


def configure_logger() -> None:
    numeric_level = getattr(logging, LOG_LEVEL, logging.INFO)
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            },
            "access": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stderr",
            },
            "access": {
                "formatter": "access",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "uvicorn.error": {
                "level": numeric_level,
                "handlers": ["default"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": numeric_level,
                "handlers": ["access"],
                "propagate": False,
            },
        },
        "root": {
            "level": numeric_level,
            "handlers": ["default"],
            "propagate": False,
        },
    }

    logging.config.dictConfig(log_config)
