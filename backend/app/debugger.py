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
from os import getenv

logger = logging.getLogger(__name__)


def initialize_server_debugger_if_needed():
    if getenv("DEBUGGER") == "True":
        import multiprocessing

        if multiprocessing.current_process().pid > 1:
            import debugpy

            debugpy.listen(("0.0.0.0", 10001))
            logging.info(
                "⏳ VS Code debugger can now be attached, using `Launch BE Debugger` in VS Code ⏳",
            )
            debugpy.wait_for_client()
            logger.info("� VS Code debugger attached, enjoy debugging �")
