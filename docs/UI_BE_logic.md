# Interaction logic between user interface and backend

This document explains the workflow of using the web application in the form of sequence diagrams. We start by listing and describing the main UI panels. Then we explain the basic workflow in Login Screen, Realtime Screen and History Screen.

## UI Panels
The UI consists of the following panels that can be found in their corresponding files of the various [components] folders.
- [`src/components`](../frontend/app/src/components/)
- [`src/features/login-screen/components`](../frontend/app/src/features/login-screen/components)
- [`src/features/human-detection/components`](../frontend/app/src/features/human-detection/components)
- [`src/features/human-detection/realtime-mode/components`](../frontend/app/src/features/human-detection/realtime-mode/components)
- [`src/features/human-detection/history-mode/components`](../frontend/app/src/features/human-detection/history-mode/components)

The following sections describe the main panels and how they interact with the backend.

![Login Screen](./media/components_login_screen.png)

### Common
<details>
<summary><b>HeaderBar</b></summary>

[`HeaderBar`](../frontend/app/src/components/HeaderBar.tsx) displays the name of the app, the selected console type, and contains buttons to switch between Realtime Screen and History Screen. It also provides a button to return to Console selection.
</details>

### Login Screen
<details>
<summary><b>SelectConsolePanel</b></summary>

[`SelectConsolePanel`](../frontend/app/src/features/login-screen/components/SelectConsolePanel.tsx) allows the user to select which Console to use, from among the listed ones.

Endpoints used by `SelectConsolePanel` and its children:
- [*Router* `/connection`](../backend/app/routers/connection.py)
  - `GET /connection`
  - `PUT /connection`
- [*Router* `/client`](../backend/app/routers/client.py)
  - `GET /client`

FE-BE interaction for this panel is implemented in:
- [*ConsoleConfiguration.tsx*](../frontend/app/src/features/login-screen/utils/ConsoleConfiguration.tsx)
</details>

<details>
<summary><b>OnlineCredentialsPanel</b></summary>

[`OnlineCredentialsPanel`](../frontend/app/src/features/login-screen/components/OnlineCredentialsPanel.tsx) allows the user to specify the configuration options required to access any type of Online Console. These options include which endpoints to use, as well as the Client credentials.

Endpoints used by `OnlineCredentialsPanel` and its children:
- [*Router* `/connection`](../backend/app/routers/connection.py)
  - `GET /connection`
  - `PUT /connection`
- [*Router* `/devices`](../backend/app/routers/device.py)
  - `GET /devices`

FE-BE interaction for this panel is implemented in:
- [*DeviceInfoFromConsole.tsx*](../frontend/app/src/utils/DeviceInfoFromConsole.tsx)
</details>

### Realtime Screen

![Realtime Screen](./media/components_realtime_screen.png)

<details>
<summary><b>DeviceModelSelectionPanel</b></summary>


[`DeviceModelSelectionPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/DeviceModelSelectionPanel.tsx) allows the user to select Device and Model from those available in the selected Console. Initially, only the Device selection is enabled, and once the user has selected a Device, the Model selection is enabled as well, listing all the models in the device.

Endpoints used by `DeviceModelSelectionPanel` and its children:
- [*Router* `/devices`](../backend/app/routers/device.py)
  - `GET /devices/{device_id}`

FE-BE interaction for this panel is implemented in:
- [*DeviceInfoFromConsole.tsx*](../frontend/app/src/utils/DeviceInfoFromConsole.tsx)
</details>

<details>
<summary><b>ConfigurationParameterPanel</b></summary>

[`ConfigurationParameterPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ConfigurationParameterPanel.tsx) contains child components for displaying and adjusting the configuration parameters of the app.

Child components of `ConfigurationParameterPanel`:
  - [`DefaultSettingsPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/DefaultSettingsPanel.tsx)
  - [`ExtraSettingsPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ExtraSettingsPanel.tsx)

**DefaultSettingsPanel**

This panel allows the user to visualize and edit the device configuration values using sliders and checkboxes. The list of editable values is hardcoded in the Sample Application, and it's independent of the Console selection.

This panel does not communicate with the Backend. The updates in the configuration are stored locally, and communicated to the Backend with starting inference using the [*ButtonPanel*](#buttonpanel).

**ExtraSettingsPanel**

This panel allows the user to visualize and edit the device configuration values in a JSON manner. The exact format of the configuration will depend on various factors, such as the type of Console used or the device selected.

This panel does not communicate with the Backend. The updates in the configuration are stored locally, and communicated to the Backend with starting inference using the [*ButtonPanel*](#buttonpanel).
</details>

<details>
<summary><b>ButtonPanel</b></summary>

[`ButtonPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ButtonPanel.tsx) serves to collect together buttons of *Start inference* and *Stop inference*.

Endpoints used by `ButtonPanel` and its children:
- [*Router* `/configuration`](../backend/app/routers/configuration.py):
  - `PATCH /configurations/{file_name}`
- [*Router* `/processing`](../backend/app/routers/processing.py):
  - `POST /processing/start_processing/{device_id}`
  - `POST /processing/stop_processing/{device_id}`

FE-BE interaction for this panel is implemented in:
- [*EdgeAppConfigurationFromConsole.tsx*](../frontend/app/src/utils/EdgeAppConfigurationFromConsole.tsx)
- [*ProcessingService.tsx*](../frontend/app/src/utils/ProcessingService.tsx)
</details>

<details>
<summary><b>ImageVisualizationPanel</b></summary>

[`ImageVisualizationPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ImageVisualizationPanel.tsx) visualizes the latest captured images and displays inference results according to the selected solution type.

Child components of `ImageVisualizationPanel`:
- [`SolutionTab`](../frontend/app/src/features/human-detection/components/SolutionTab.tsx)
- [`BBoxHumanoidTab`](../frontend/app/src/features/human-detection/components/BBoxHumanoidTab.tsx)
- [`Canvas`](../frontend/app/src/features/human-detection/components/Canvas.tsx)
- [`InferenceDataDisplay`](../frontend/app/src/features/human-detection/components/InferenceDataDisplay.tsx)

Endpoints used by `ImageVisualizationPanel` and its children:
- [*Router* `/processing`](../backend/app/routers/processing.py)
  - Connection to a `/processing/ws`

FE-BE interaction for this panel is implemented in:
- [*ImageStream.tsx*](../frontend/app/src/utils/ImageStream.tsx)
</details>

<details>
<summary><b>ExtraInfoPanel</b></summary>

[`ExtraInfoPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ExtraInfoPanel.tsx) visualizes inference data as timeseries graphs for realtime screen.

Child components of `ExtraInfoPanel`:
- [`PeopleCountPlot`](../frontend/app/src/features/human-detection/realtime-mode/components/PeopleCountPlot.tsx)
- [`PeopleCountInRegionsPlot`](../frontend/app/src/features/human-detection/realtime-mode/components/PeopleCountInRegionsPlot.tsx)
</details>

</details>

### History Screen

![History Screen](./media/components_history_screen.png)

<details>
<summary><b>DeviceSelectionPanel</b></summary>

[`DeviceSelectionPanel`](../frontend/app/src/features/human-detection/history-mode/components/DeviceSelectionPanel.tsx) allows the user to select a Device. Once the user has selected a device, subsequent panels become available.

Endpoints used by `DeviceSelectionPanel` and its children:
- [*Router* `/devices`](../backend/app/routers/device.py)
  - `GET /devices/{device_id}`

FE-BE interaction for this panel is implemented in:
- [*DeviceInfoFromConsole.tsx*](../frontend/app/src/utils/DeviceInfoFromConsole.tsx)
</details>

<details>
<summary><b>PlaybackSourcePanel</b></summary>

[`PlaybackSourcePanel`](../frontend/app/src/features/human-detection/history-mode/components/PlaybackSourcePanel.tsx) allows users to select between image-based or time-based methods for retrieving historical inference data.

Child components of `PlaybackSourcePanel`:
  - [`DirectorySelectionPanel`](../frontend/app/src/features/human-detection/history-mode/components/DirectorySelectionPanel.tsx)
  - [`DateTimeRangePanel`](../frontend/app/src/features/human-detection/history-mode/components/DateTimeRangePanel.tsx)

**DirectorySelectionPanel**

This panel allows the user to select an image directory based on the selected device. These selections of image data sources are stored locally and communicated to the Backend when fetching images and inferences associated with images using the PlaybackControlPanel.

Endpoints used by `DeviceSelectionPanel` and its children:
- [*Router* `/insight`](../backend/app/routers/insight.py)
  - `GET /insight/directories/{device_id}`

FE-BE interaction for this panel is implemented in:
- [*ImagesAndInferencesFromConsole.tsx*](../frontend/app/src/utils/ImagesAndInferencesFromConsole.tsx)


**DateTimeRangePanel**

This panel allows the user to select datetime range for configuring the metadata retrieval scope based on the selected device. These selections are stored locally and communicated to the Backend when fetching metadata using the PlaybackControlPanel.
</details>

<details>
<summary><b>PlaybackControlPanel</b></summary>

[`PlaybackControlPanel`](../frontend/app/src/features/human-detection/history-mode/components/PlaybackControlPanel.tsx) serves to collect together buttons of Start playback and Stop playback.

Endpoints used by `PlaybackControlPanel` and its children:
- [*Router* `/insight`](../backend/app/routers/insight.py)
  - `GET /insight/images_and_inferences/{device_id}/{sub_directory_name}`
  - `GET /insight/inferences/{device_id}`

FE-BE interaction for this panel is implemented in:
- [*ImagesAndInferencesFromConsole.tsx*](../frontend/app/src/utils/ImagesAndInferencesFromConsole.tsx)
</details>

<details>
<summary><b>ImageVisualizationPanel</b></summary>

[`ImageVisualizationPanel`](../frontend/app/src/features/human-detection/history-mode/components/ImageVisualizationPanel.tsx) visualizes captured images and displays inference results according to the selected solution type. Unlike the Realtime Screen, this panel shows images one by one from a batch retrieved by the PlaybackControlPanel.

Child components of `ImageVisualizationPanel`:
- [`SolutionTab`](../frontend/app/src/features/human-detection/components/SolutionTab.tsx)
- [`BBoxHumanoidTab`](../frontend/app/src/features/human-detection/components/BBoxHumanoidTab.tsx)
- [`Canvas`](../frontend/app/src/features/human-detection/components/Canvas.tsx)
- [`InferenceDataDisplay`](../frontend/app/src/features/human-detection/components/InferenceDataDisplay.tsx)
</details>

<details>
<summary><b>ExtraInfoPanel</b></summary>

[`ExtraInfoPanel`](../frontend/app/src/features/human-detection/history-mode/components/ExtraInfoPanel.tsx) visualizes inference data as timeseries graphs for history screen.

Child components of `ExtraInfoPanel`:
- [`PeopleCountPlot`](../frontend/app/src/features/human-detection/history-mode/components/PeopleCountPlot.tsx)
- [`PeopleCountInRegionsPlot`](../frontend/app/src/features/human-detection/history-mode/components/PeopleCountInRegionsPlot.tsx)
</details>

## FE-BE Interactions

### User Workflow Overview

1. **Open the Application**
   Launch the app and see the HeaderBar and SelectConsolePanel.

2. **Select Console & Enter Credentials**
   Choose a Console, enter credentials in OnlineCredentialsPanel, and apply.

3. **Realtime Mode**
   - Select device/model in DeviceModelSelectionPanel.
   - Adjust parameters in ConfigurationParameterPanel.
   - Start inference with ButtonPanel.
   - View realtime results in ImageVisualizationPanel and ExtraInfoPanel.

4. **History Mode**
   - Select device in DeviceSelectionPanel.
   - Choose data source in PlaybackSourcePanel.
   - Start playback with PlaybackControlPanel.
   - View historical results in ImageVisualizationPanel and ExtraInfoPanel.


### Login screen

<details>
<summary><b>Console selection and credential setup flow</b></summary>

This is the screen to configure the settings to connect to the selected Console project.

```mermaid
---
title:  Sequence diagram for console version selection, credential input and validation
---
sequenceDiagram
    actor U as User
    box Application
    participant F as FrontEnd
    participant B as BackEnd
    end
  U -)  +F: Goes to the app web page.
  F --) -U: Returns the Console Version Selection Screen
  U -)  +F: Selects the desired Console Version.
    F -) +B: Sets the console version using `PUT /client`.
    B --) -F: Returns ok.
    F -) +B: Requests current credentials stored in the backend using `GET /connection`.
    B --) -F: Returns current credentials or default values if none stored
    F ->> F: If error or default values are detected, check for values in local storage
  F --) -U: Returns the Credentials Screen

  opt
    Note over U, F: Providing credentials
    U -)  +F: Types in a value of Console endpoint.
    F --) -U: Renders the Credentials Screen with the Console endpoint value.
    U -)  +F: Types in a value of Portal authorization endpoint.
    F --) -U: Renders the Credentials Screen with the Portal authorization endpoint value.
    U -)  +F: Types in a value of ClientID.
    F --) -U: Renders the Credentials Screen with the ClientID value.
    U -)  +F: Types in a value of ClientSecret.
    F --) -U: Renders the Credentials Screen with the ClientSecret value (hidden).
  end

  Note over U, B: Validating credentials
  U -) +F: Presses the button "Set credentials"

  F -)  +B: Passes the credentials to the BE using `PUT /connection`.
  B --) -F: Returns ok.

  alt correct connection credentials for AITRIOS Console
  F -)  +B: Requests device list from the BE using `GET /devices`.
      B --) -F: Returns device list.
      F ->> F: Updates credentials stored in local storage
    F --) U: Renders the Main application screen.

  else errorneous connection credentials for AITRIOS Console
  F -)  +B: Requests device list from the BE using `GET /devices`.
      B --) -F: Returns error.
    F --) U: Renders the Credentials screen marking the provided credentials as erroneous.
  end
  deactivate F
```
</details>


### Realtime Screen

<details>
<summary><b>Device and model information flow</b></summary>

This sections describes the flow of information to select the console, device, model and edge application to use. These interactions are contained in the [`DeviceModelSelectionPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/DeviceModelSelectionPanel.tsx) and its components. Once the user selects a console and sets the credentials, this panel allows them to select a device and a model previously deployed on this device. Once the selection is accepted, the application fetches an image and the device configuration, and displays them in the `ImageVisualizationPanel` and `ConfigurationParameterPanel` respectively.

Child components of `DeviceModelSelectionPanel`:
- [*ApplySelection.tsx*](../frontend/app/src/features/human-detection/realtime-mode/components/ApplySelection.tsx)
- [*DeviceSelector.tsx*](../frontend/app/src/features/human-detection/realtime-mode/components/DeviceSelector.tsx)
- [*ModelSelector.tsx*](../frontend/app/src/features/human-detection/realtime-mode/components/ModelSelector.tsx)

Endpoints used by `DeviceModelSelectionPanel` and its children:
- [*Router* `/device`](../backend/app/routers/device.py)
  - `GET /devices/`
  - `GET /devices/{device_id}`
- [*Router* `/configuration`](../backend/app/routers/configuration.py)
  - `GET /configurations/{device_id}`
- [*Router* `/processing`](../backend/app/routers/processing.py)
  - `GET /processing/image/{device_id}`

FE-BE interaction is implemented in:
- [*DeviceInfoFromConsole.tsx*](../frontend/app/src/utils/DeviceInfoFromConsole.tsx)
- [*EdgeAppConfigurationFromConsole.tsx*](../frontend/app/src/utils/EdgeAppConfigurationFromConsole.tsx)
- [*GetImageFromConsole.tsx*](../frontend/app/src/utils/GetImageFromConsole.tsx)


```mermaid
---
title: Device and model information flow
---
sequenceDiagram
    actor U as User
    box Application
    participant F as FrontEnd
    participant B as BackEnd
    end
    U ->>+ F: Clicks "Set Credentials"
    F -) +B: «DeviceModelSelectionPanel» calls «GET /devices»
    B --) -F: Return a list of available devices
  F --) -U: Renders the list of all available devices <br> Renders a disabled dropdown for model selection

  U -)  +F: Select a device
    F -) +B: «DeviceSelector» calls «GET /devices/{device_id}»
  F --) -U: Enables choosing a model with  the «ModelSelector» component
  B --) -F: Returns a list of models available on the device
  activate F
  F --) U: Rerenders a «ModelSelector» component with updated list of models on device
  deactivate F

  U -)  +F: Select a model from a drop-down menu of a «ModelSelector» component
  F --) -U: Enables «Apply» button

  U -)  +F: Clicks  «Apply»  button
    F -) +B: ApplySelection component requests calls «GET /processing/image/{device_id}» <br> for a representative image
    F -) +B: ApplySelection component calls «GET /configurations/{device_id}»
  activate F
    B --) -F: Returns device configuration
    F --) -U: Renders a «ConfigurationParameterPanel» with parameter values<br>from the obtained configuration info or default values if no configuration is present
  deactivate F
  activate F
    B --) -F: Returns a representative image
    F --) U: reference images with inference results <br> drawn according to the rendering method for each data type.
  deactivate F

```
</details>

<details>
<summary><b>Device configuration flow</b></summary>



This sections describes the flow to interact with the Device/Application configurations. These interactions are contained in the [`ConfigurationParameterPanel`](../frontend/app/src/features/human-detection/realtime-mode/components/ConfigurationParameterPanel.tsx). This panel displays the configuration parameters of an Edge Application that a user can change from UI, which includes sliders and checkboxes for some of the parameters. All the changes performed on this panel are stored in the Frontend and are only passed to the Backend upon pressing the button "Start Inference" in the `ButtonPanel`.

This panel is first rendered with the default values and is blocked for change while the application is receiving and parsing the device configuration information. Upon its completion, the components are rendered again with the values obtained, and only then the frontend enables modifying its values.

Child components of `ConfigurationParameterPanel`:
- [*CustomCheckBox.tsx*](../frontend/app/src/components/CustomCheckBox.tsx)
- [*CustomSlider.tsx*](../frontend/app/src/components/CustomSlider.tsx)


```mermaid
---
title: Device configuration flow
---
sequenceDiagram
    actor U as User
    box Application
    participant F as FrontEnd
    participant B as BackEnd
    end

  U -)  +F: Clicks  «Apply»  button
    F -) +B: «ApplySelection» component requests the device configuration information <br> using a «GET /configurations/{device_id}» endpoint
  F --) -U: Renders a «ConfigurationParameterPanel» with default parameter values
    B --) -F: Returns configuration information
  activate F
  F --) U: Renders a «ConfigurationParameterPanel» with parameter values<br>from the obtained configuration information
  deactivate F

  U -) +F: Updates sliders, value fields or a checkbox
    F --) F: Updates internal representation of selected configuration parameters
  F --) -U: Renders correct representation of the value in all the relevant components

  U -) +F: Selects the icon of a gear in the parameters configuration section
  F --) -U: Renders the «ExtraSettingsPanel» with the device configuration displayed in JSON format <br> Enables «Apply» button

  U -)  +F: Adjusts configuration in JSON files and clicks on «Apply»
    F --) F: Updates internal representation of selected configuration parameters
  F --) -U: Renders «ConfigurationParameterPanel» again <br> Shows updated values in all the relevant components

  U -) +F: Clicks the «Start Inference» button in the «ButtonPanel»
    opt Configuration parameters differ from the previous ones
      F -) +B: «handleStartInference» in «ButtonPanel» checks configuration <br> and calls «PATCH /configurations/{device_id}/{configuration_id}»
      B --) -F: Response
    end

    F -) +B: «handleStartInference» in «ButtonPanel» calls «POST /processing/start_processing/{device_id}»
    B --) -F: Response
    F --) F: Enables receiving images and inference results through a web socket <br>Draws inference results in «ImageVisualizationPanel»
  F --) -U: Replaces «Start Inference» button with «Stop Inference» button
```
</details>


<details>
<summary><b>Region configuration flow</b></summary>

This section describes the flow for interacting with Region settings when using the "People Count in Regions" feature. These interactions are contained in the [`RegionSelectionPanel`](../frontend/app/src/features/human-detection/components/RegionSelectionPanel.tsx). The sequence diagram below illustrates the process:

- initial loading of settings files
- configuration of regions through the GUI
- saving changes to settings files
- processing inference data based on configuration files in the backend

Endpoints used by `RegionSelectionPanel` and their children:
- [*Router* `/app-config`](../backend/app/routers/app_config.py)
  - `GET /app-config/`
  - `PATCH /app-config/`

```mermaid
---
title: Region configuration flow
---
sequenceDiagram
    actor U as User
    box Application
    participant F as Frontend
    participant B as Backend
    end

    U -) +F: Login
    F -) +B: Automatically fetch configuration file (GET /app-config/)
    B --) -F: Return initial configuration values
    F --) -U: Display initial regions

    U -) +F: Configure regions using «RegionSelectionPanel»
    F --) F: Update context values for selected regions
    U -) F: Press "ACCEPT REGION" button
    F -) +B: Send region data (PATCH /app-config/regions)
    B --) B: Update region information in configuration file
    B --) -F: Update successful response

    U -) +F: "Start Inference"
    F -) +B: Start inference /start_processing/
    B --) B: Load latest configuration values
    activate B
    B --) B: Retrieve data from Console
    B --) B: People count in selected regions
    deactivate B
    B --) -F: Send processed data
    F --) -U: Visualize people count in regions
```
</details>


<details>
<summary><b>Getting images and inferences flow</b></summary>

```mermaid
---
title: Getting images and inferences flow
---
sequenceDiagram
    actor U as User
    box Application
    participant F as FrontEnd
    participant B as BackEnd
    end
    U ->>+ F: Click «Start Inference»
    F ->>+ B: «ButtonPanel» calls «POST /processing/start_processing/{device_id}»
    B -->>- F: Response
    F -->>- U: Show inference running state

    loop Inference running
        B -->> F: Send images & inference results (WebSocket /processing/ws)
        F -->> U: Render images and inference results in «ImageVisualizationPanel»
    end

    U ->>+ F: Click «Stop Inference»
    F ->>+ B: Stop inference calls «POST /processing/stop_processing/{device_id}»
    B -->>- F: Response
    F -->>- U: Show stopped state, display last result
```

</details>


### History Screen

<details>
<summary><b>Main flow</b></summary>

This section describes the flow of information for fetching historical inference data by selecting image folders (IMAGES AND METADATA) or by selecting datetime ranges (METADATA ONLY). These interactions are contained in the [`PlaybackSourcePanel`](../frontend/app/src/features/human-detection/history-mode/components/PlaybackSourcePanel.tsx) and its components. Once the selection is accepted, the application fetches an images and inference results, and displays them in the [`ImageVisualizationPanel`](../frontend/app/src/features/human-detection/history-mode/components/ImageVisualizationPanel.tsx).

Child components of `PlaybackSourcePanel`:
- [`DirectorySelectionPanel`](../frontend/app/src/features/human-detection/history-mode/components/DirectorySelectionPanel.tsx)
  - [`DirectorySelector`](../frontend/app/src/features/human-detection/history-mode/components/DirectorySelector.tsx)
- [`DateTimeRangePanel`](../frontend/app/src/features/human-detection/history-mode/components/DateTimeRangePanel.tsx)

Endpoints used by `DeviceSelectionPanel`, `PlaybackSourcePanel`, `PlaybackControlPanel` and their children:
- [*Router* `/device`](../backend/app/routers/device.py)
  - `GET /devices/`
- [*Router* `/insight`](../backend/app/routers/insight.py)
  - `GET /insight/directories/{device_id}`

- [*Router* `/insight`](../backend/app/routers/insight.py)
  - `GET /insight/images_and_inferences/{device_id}/{sub_directory_name}`
  - `GET /insight/inferences/{device_id}`

FE-BE interaction is implemented in:
- [*DeviceInfoFromConsole.tsx*](../frontend/app/src/utils/DeviceInfoFromConsole.tsx)
- [*ImagesAndInferencesFromConsole.tsx*](../frontend/app/src/utils/ImagesAndInferencesFromConsole.tsx)

```mermaid
---
title: Main flow in History Screen
---
sequenceDiagram
    actor U as User
    box Application
    participant F as FrontEnd
    participant B as BackEnd
    end

    U ->>+ F: Select «HISTORY» on «HeaderBar»
    F ->>+ B: «DeviceSelectionPanel» requests devices (GET /devices)
    B -->>- F: Return list of devices
    F -->>- U: Render device list

    U ->>+ F: Select a device
    F ->>+ B: «DeviceSelector» requests directories (GET /insight/directories/{device_id})
    B -->>- F: Return list of directories
    F -->>- U: Render directory list, enable source type selection

    U ->>+ F: Select source type («IMAGES AND METADATA» or «METADATA ONLY»)
    alt IMAGES AND METADATA
        F -->> U: Render «DirectorySelectionPanel»
        U ->>+ F: Select a directory in «DirectorySelector»
    else METADATA ONLY
        F -->> U: Render «DateTimeRangePanel»
        U ->>+ F: Select datetime range
    end
    F -->> F: Update context values

    U ->>+ F: Click "Start Playback" in «PlaybackControlPanel»
    alt IMAGES AND METADATA
        F ->>+ B: Fetch images & inferences <br> (GET /insight/images_and_inferences/{device_id}/{sub_directory_name})
        B -->>- F: Return images & inferences batch
        F -->>- U: Render images and inference results in «ImageVisualizationPanel»
    else METADATA ONLY
        F ->>+ B: Fetch inferences <br> (GET /insight/inferences/{device_id}?from_datetime=...&to_datetime=...)
        B -->>- F: Return inferences batch
        F -->>- U: Render inference results in «ImageVisualizationPanel»
    end

    U ->>+ F: Navigate/playback inference and images
    F -->>- U: Update displayed snapshot result
```

</details>