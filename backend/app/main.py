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

from app.debugger import initialize_server_debugger_if_needed
from app.routers import app_config
from app.routers import client
from app.routers import configuration
from app.routers import connection
from app.routers import device
from app.routers import insight
from app.routers import processing
from app.utils.logger import configure_logger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

configure_logger()
logger = logging.getLogger(__name__)

initialize_server_debugger_if_needed()

app = FastAPI()
app.include_router(device.router)
app.include_router(configuration.router)
app.include_router(app_config.router)
app.include_router(processing.router)
app.include_router(connection.router)
app.include_router(client.router)
app.include_router(insight.router)

origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://172.17.0.3:3000",
    "http://localhost:3000",
    "http://172.17.0.2:3000",
    "http://0.0.0.0",
    "http://reference-solution-zone-detection.local",
    "http://ui.reference-solution-zone-detection.local",
]

codespace_name = os.getenv("CODESPACE_NAME")
if codespace_name:
    codespace_url = f"https://{codespace_name}-3000.app.github.dev"
    origins.append(codespace_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "human_detection_rest_api", "version": "0.1.0"}
