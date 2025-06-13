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
from datetime import datetime

logger = logging.getLogger(__name__)


def convert_iso_timestamp_to_numeric(timestamp: str) -> str:
    """
    Converts an ISO timestamp to numeric format.

    Example:
        >>> convert_iso_timestamp_to_numeric('2025-01-01T00:00:00.000')
        '20250101000000000'
        convert_iso_timestamp_to_numeric('20250101000000000')
        '20250101000000000'
    """
    try:
        dt = datetime.fromisoformat(timestamp)
        return dt.strftime("%Y%m%d%H%M%S%f")[:-3]
    except ValueError:
        return timestamp


def convert_numeric_timestamp_to_iso(timestamp: str) -> str:
    """
    Converts a numeric timestamp to ISO format without timezone.

    Example:
        >>> convert_numeric_timestamp_to_iso('20250101000000000')
        '2025-01-01T00:00:00.000'
    """
    try:
        dt = datetime.strptime(timestamp, "%Y%m%d%H%M%S%f")
        return dt.replace(tzinfo=None).isoformat(timespec="milliseconds")
    except ValueError as e:
        logger.error(f"Invalid timestamp format: {timestamp}. Error: {e}")
        raise
