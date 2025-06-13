import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import ExtraSettingsButton from "./ExtraSettingsButton";
import ExtraSettingsPanel from "./ExtraSettingsPanel";
import DefaultSettingsPanel from "./DefaultSettingsPanel";
import Grid from "@mui/material/Grid2";
import {
  isInferenceStages,
  isInitialStages,
  useScreenContext,
} from "../../../../stores/ScreenContext";

export default function ConfigurationParameterPanel() {
  const { screenStage } = useScreenContext();

  const disableExtraSettingsButton: boolean =
    isInferenceStages(screenStage) ||
    isInitialStages(screenStage) ||
    screenStage === "parameter_loading";

  return (
    <>
      <Card variant="outlined" sx={{ p: 2, alignLeft: "auto" }}>
        <Stack direction="column" spacing={1}>
          <Grid sx={{ float: "right", alignLeft: "auto" }}>
            <ExtraSettingsButton disabled={disableExtraSettingsButton} />
          </Grid>
          {screenStage === "extra_parameter_selection" ? (
            <ExtraSettingsPanel />
          ) : (
            <DefaultSettingsPanel />
          )}
        </Stack>
      </Card>
    </>
  );
}
