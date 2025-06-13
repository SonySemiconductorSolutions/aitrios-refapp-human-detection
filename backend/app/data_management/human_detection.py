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
import queue

import numpy as np
from app.schemas.common import SolutionType
from shapely.geometry import Point
from shapely.geometry import Polygon


logger = logging.getLogger(__name__)


def create_human_detection_counter(solution_type: SolutionType, app_config):
    if solution_type == SolutionType.people_count:
        return PeopleCount()
    elif solution_type == SolutionType.people_count_in_regions:
        return PeopleCountInRegions(app_config)
    elif solution_type == SolutionType.heatmap:
        return Heatmap(app_config)
    else:
        raise ValueError(f"Unsupported solution type: {solution_type}")


class PeopleCount:
    def add_processed_data(self, parsed_inference):
        if parsed_inference is None:
            return parsed_inference
        return {
            **parsed_inference,
            "people_count": self.process_data(parsed_inference),
        }

    def process_data(self, parsed_inference):
        try:
            if (
                parsed_inference is None
                or not parsed_inference["perception"]["object_detection_list"]
            ):
                people_count = 0
                return people_count

            people_count = self._people_count(parsed_inference)
            return people_count

        except KeyError as e:
            logger.error(f"Key Error while processing people count: {e}", exc_info=True)
            return None
        except Exception as e:
            logger.error(
                f"Unexpected error while processing people count: {e}", exc_info=True
            )
            return None

    def _people_count(self, parsed_inference):
        detections = parsed_inference["perception"]["object_detection_list"]
        people_count = len(detections)
        return people_count


class PeopleCountInRegions:

    def __init__(self, settings):
        people_count_in_regions_settings = settings["people_count_in_regions_settings"]

        self.bbox_to_point_ratio = people_count_in_regions_settings[
            "bbox_to_point_ratio"
        ]
        self.regions = people_count_in_regions_settings["regions"]

    def add_processed_data(self, parsed_inference):
        if parsed_inference is None:
            return parsed_inference
        return {
            **parsed_inference,
            "people_count_in_regions": self.process_data(parsed_inference),
        }

    def process_data(self, parsed_inference):
        try:
            if (
                parsed_inference is None
                or not parsed_inference["perception"]["object_detection_list"]
            ):
                people_count_in_regions = {region["id"]: 0 for region in self.regions}
                return people_count_in_regions

            head_points = self._get_head_points_from_bbox(parsed_inference)
            people_count_in_regions = {
                region["id"]: self._count_points_in_region(head_points, region)
                for region in self.regions
            }
            return people_count_in_regions

        except KeyError as e:
            logger.error(
                f"Key error while processing people count in regions: {e}",
                exc_info=True,
            )
            return None
        except Exception as e:
            logger.error(
                f"Unexpected error while processing people count in regions: {e}",
                exc_info=True,
            )
            return None

    def _get_head_points_from_bbox(self, parsed_inference):
        points = []
        object_detection_list = parsed_inference["perception"]["object_detection_list"]
        for obj in object_detection_list:
            bbox = obj["bounding_box"]
            center_x = (bbox["left"] + bbox["right"]) / 2
            center_y = (
                self.bbox_to_point_ratio * bbox["top"]
                + (1 - self.bbox_to_point_ratio) * bbox["bottom"]
            )
            points.append((center_x, center_y))
        return points

    def _count_points_in_region(self, points, region):
        polygon = Polygon(
            [
                (region["left"], region["bottom"]),  # left bottom
                (region["left"], region["top"]),  # left top
                (region["right"], region["top"]),  # right top
                (region["right"], region["bottom"]),  # right bottom
            ]
        )

        count = 0

        for x, y in points:
            point = Point(x, y)
            if polygon.contains(point):
                count += 1

        return count


class Heatmap:
    def __init__(self, settings, sigma=5, alpha=0.1):
        heatmap_settings = settings["heatmap_settings"]

        self.image_size_w = heatmap_settings["image_size_w"]
        self.image_size_h = heatmap_settings["image_size_h"]
        self.grid_num_w = heatmap_settings["grid_num_w"]
        self.grid_num_h = heatmap_settings["grid_num_h"]
        self.bbox_to_point_ratio = heatmap_settings["bbox_to_point_ratio"]
        self.sigma = sigma
        self.alpha = alpha

        self._queue = queue.Queue(maxsize=heatmap_settings["last_valid_frame"])

        self.griddata = np.zeros((self.grid_num_h, self.grid_num_w))

        self.grid_size_w = self.image_size_w // self.grid_num_w
        self.grid_size_h = self.image_size_h // self.grid_num_h

    def add_processed_data(self, parsed_inference):
        if parsed_inference is None:
            return parsed_inference
        return {
            **parsed_inference,
            "heatmap": self.process_data(parsed_inference),
        }

    def process_data(self, parsed_inference):
        try:
            if (
                parsed_inference is None
                or not parsed_inference["perception"]["object_detection_list"]
            ):
                if self._queue.full():
                    old_grid_points = self._queue.get()
                    self.griddata -= self._generate_temp_griddata(old_grid_points)
                    return self.griddata

            points = self._get_head_points_from_bbox(parsed_inference)
            grid_points = self._convert_to_grid_from_pixel(points)

            if self._queue.full():
                old_grid_points = self._queue.get()
                self.griddata -= self._generate_temp_griddata(old_grid_points)

            self.griddata += self._generate_temp_griddata(grid_points)
            self._queue.put(grid_points)

            # Convert NumPy array to list for JSON serialization in WebSocket transmission
            return self.griddata.tolist()

        except KeyError as e:
            logger.error(f"Key error while processing heatmap: {e}", exc_info=True)
            return None
        except ValueError as e:
            logger.error(f"Value error while processing heatmap: {e}", exc_info=True)
            return None
        except Exception as e:
            logger.error(f"Unexpected error: {e}", exc_info=True)
            return None

    def _get_head_points_from_bbox(self, parsed_inference):
        points = []
        object_detection_list = parsed_inference["perception"]["object_detection_list"]
        for obj in object_detection_list:
            bbox = obj["bounding_box"]
            center_x = (bbox["left"] + bbox["right"]) / 2
            center_y = (
                self.bbox_to_point_ratio * bbox["top"]
                + (1 - self.bbox_to_point_ratio) * bbox["bottom"]
            )
            points.append((center_x, center_y))
        return points

    def _convert_to_grid_from_pixel(self, points):
        grid_points = []
        for point_x, point_y in points:
            grid_x = int(point_x // self.grid_size_w)
            grid_y = int(point_y // self.grid_size_h)

            if 0 <= grid_x < self.grid_num_w and 0 <= grid_y < self.grid_num_h:
                grid_points.append((grid_x, grid_y))
            else:
                raise ValueError(f"Point ({point_x}, {point_y}) is out of bounds.")

        return grid_points

    def _generate_temp_griddata(self, grid_points):
        temp_grid_data = np.zeros((self.grid_num_h, self.grid_num_w))
        for grid_x, grid_y in grid_points:
            temp_grid_data[grid_y, grid_x] += 1
        return temp_grid_data
