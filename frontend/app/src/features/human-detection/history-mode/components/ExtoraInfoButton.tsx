import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";

import {
  isPeopleCount,
  isPeopleCountInRegions,
  useAppContext,
} from "../../../../stores/AppContext.tsx";
import { useHistoryDataContext } from "../../../../stores/HistoryDataContext.tsx";
import {
  PeopleCountInference,
  PeopleCountInRegionsInference,
  PeopleCountInRegionsTelemetry,
  PeopleCountTelemetry,
} from "../../../../types/types.tsx";
import PeopleCountPlot from "./PeopleCountPlot.tsx";
import PeopleCountInRegionsPlot from "./PeopleCountInRegionsPlot.tsx";

export default function ExtraInfoPanel() {
  const { solutionType } = useAppContext();
  const { historyData } = useHistoryDataContext();

  if (!isPeopleCount(solutionType) && !isPeopleCountInRegions(solutionType)) {
    return null;
  }

  let telemetries: PeopleCountTelemetry[] | PeopleCountInRegionsTelemetry[] =
    [];

  if (isPeopleCount(solutionType) && Array.isArray(historyData.data)) {
    telemetries = historyData.data
      .map((item) => ({
        timestamp: item.timestamp,
        people_count: (item.inference as PeopleCountInference).people_count,
      }))
      .filter(
        (telemetry) =>
          telemetry?.timestamp != null && telemetry?.people_count != null,
      );
  }

  if (isPeopleCountInRegions(solutionType) && Array.isArray(historyData.data)) {
    telemetries = historyData.data
      .map((item) => ({
        timestamp: item.timestamp,
        people_count_in_regions: (
          item.inference as PeopleCountInRegionsInference
        ).people_count_in_regions,
      }))
      .filter(
        (telemetry) =>
          telemetry?.timestamp != null &&
          telemetry?.people_count_in_regions != null,
      );
  }

  return (
    <>
      <Grid size={12}>
        <Card variant="outlined" sx={{ p: 2 }}>
          {isPeopleCount(solutionType) && (
            <PeopleCountPlot
              telemetries={telemetries as PeopleCountTelemetry[]}
            />
          )}
          {isPeopleCountInRegions(solutionType) && (
            <PeopleCountInRegionsPlot
              telemetries={telemetries as PeopleCountInRegionsTelemetry[]}
            />
          )}
        </Card>
      </Grid>
    </>
  );
}
