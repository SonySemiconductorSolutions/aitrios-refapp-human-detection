import { useScreenContext } from "../../../../stores/ScreenContext";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import { useEdgeAppConfigurationContext } from "../../../../stores/EdgeAppConfigurationContext";
import { updateEdgeAppConfigurationIfRequired } from "../../../../utils/EdgeAppConfigurationUpdate";
import {
  startProcessing,
  stopProcessing,
} from "../../../../utils/ProcessingService";
import { useUpdateEdgeAppConfigurationState } from "../../../../hooks/EdgeAppConfigurationUpdateHook";
import { useAppContext } from "../../../../stores/AppContext";

export function useInferenceControl() {
  const { solutionType } = useAppContext();
  const { setScreenStage } = useScreenContext();
  const { deviceId } = useDeviceModelIdContext();
  const { sendImageFlag } = useEdgeAppConfigurationContext();
  const commandParamState = useUpdateEdgeAppConfigurationState();

  const StartInference = async () => {
    if (!deviceId) {
      console.error("Device ID is not available.");
      return;
    }

    setScreenStage("inference_starting");
    try {
      await updateEdgeAppConfigurationIfRequired(deviceId, commandParamState);
      const response = await startProcessing(
        deviceId,
        sendImageFlag,
        solutionType,
      );
      console.log("Start Processing Response:", response);
      setScreenStage("inference_running");
    } catch (error) {
      setScreenStage("parameter_selection");
      throw error;
    }
  };

  const StopInference = async () => {
    if (!deviceId) {
      console.error("Device ID is not available.");
      return;
    }

    setScreenStage("inference_stopping");
    try {
      const response = await stopProcessing(deviceId);
      console.log("Stop Processing Response:", response);
      setScreenStage("parameter_selection");
    } catch (error) {
      setScreenStage("inference_running");
      throw error;
    }
  };

  return { StartInference, StopInference };
}
