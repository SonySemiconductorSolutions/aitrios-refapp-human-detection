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
from base64 import b64decode
from typing import Any

from app.data_management.object_detection.SmartCamera.BoundingBox import BoundingBox
from app.data_management.object_detection.SmartCamera.BoundingBox2d import BoundingBox2d
from app.data_management.object_detection.SmartCamera.ObjectDetectionTop import (
    ObjectDetectionTop,
)


logger = logging.getLogger(__name__)


def deserialize(inference_data: str) -> ObjectDetectionTop | None:
    """
    Deserialize the given base64-encoded inference data into a FlatBuffer object.

    Args:
        inference_data (str): Base64-encoded inference data.

    Returns:
        Union[ObjectDetectionTop, None]: Deserialized ObjectDetectionTop FlatBuffer object, or None if deserialization fails.
    """
    try:
        decoded_inference = b64decode(inference_data)
        obj_detection_top = ObjectDetectionTop.GetRootAsObjectDetectionTop(
            decoded_inference, 0
        )
        return obj_detection_top
    except (ValueError, TypeError, AttributeError) as e:
        logger.error(f"Failed to deserialize inference data: {e}", exc_info=True)
        return None


def detection_data_to_json(
    obj_detection_top: ObjectDetectionTop,
) -> dict[str, Any] | None:
    """
    Convert the deserialized ObjectDetectionTop FlatBuffer object into a JSON-compatible dictionary.

    Args:
        obj_detection_top (ObjectDetectionTop): Deserialized FlatBuffer object.

    Returns:
        Union[Dict[str, Any], None]: JSON-compatible dictionary representing the object detection data, or None if an error occurs.
    """
    try:
        perception = obj_detection_top.Perception()
        object_list_length = perception.ObjectDetectionListLength()

        detection_list = []

        for i in range(object_list_length):
            obj = perception.ObjectDetectionList(i)
            detection = {
                "class_id": obj.ClassId(),
                "score": obj.Score(),
            }

            bbox_type = obj.BoundingBoxType()

            if bbox_type == BoundingBox.BoundingBox2d:
                bbox2d = BoundingBox2d()
                bbox_table = obj.BoundingBox()
                bbox2d.Init(bbox_table.Bytes, bbox_table.Pos)
                detection["bounding_box"] = {
                    "left": bbox2d.Left(),
                    "top": bbox2d.Top(),
                    "right": bbox2d.Right(),
                    "bottom": bbox2d.Bottom(),
                }
            else:
                detection["bounding_box"] = None

            detection_list.append(detection)

        result = {"perception": {"object_detection_list": detection_list}}

        return result

    except AttributeError as e:
        logger.error(
            f"Attribute error while processing detection data: {e}", exc_info=True
        )
        return None
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return None
