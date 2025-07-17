# Human Detection Application Frontend

This is the frontend service for the Human Detection Application, built with React and TypeScript, and containerized using Docker.

## Directory Structure

```
├── app/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── human-detection/
│   │   │   │   ├── realtime-mode/
│   │   │   │   └── history-mode/
│   │   │   └── login-screen/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── .dockerignore
│   ├── .env
│   ├── .env.codespace
│   ├── .env.prod
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── Dockerfile_frontend_production
├── Dockerfile_frontend_development
└── README.md
```

The current directory consists of this **`README.md`** file, an **`app`** folder and two docker files:
- **`Dockerfile_frontend_development`** used for developing frontend application.
- **`Dockerfile_frontend_production`** used for deploying frontend application to production.

### `app/`

The **`app`** directory contains various files related to the frontend application implementation, configuration and testing. Files on the top of this directory include:

- **`.dockerignore`**: Defines ignored files for Docker.
- **`.env`**, **`.env.prod`**, **`.env.codespace`**: Specify environment variable configurations for different environments.
- **`.gitignore`**: Defines ignored files for Git.
- **`eslint.config.js`**: Linting rules for maintaining code quality.
- **`index.html`**: The main HTML entry point for the frontend.
- **`package.json`** & **`package-lock.json`**: Manage dependencies and project metadata.
- **`tsconfig.json`**,**`tsconfig.app.json`**,**`tsconfig.node.json`**: Specify TypeScript configurations for different project scopes.
- **`vite.config.ts`**: Provides configuration for Vite, the frontend build tool.

The subfolders are as follows:
- **`app/src/`**: Implements the actual codebase of the frontend application.

#### `app/src/`

The `src` directory contains the core source code for the frontend application and aims at complying the [bulletproof react standard](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md). It thus has the following structure:

- **`App.tsx`** & **`main.tsx`**: Entry points for rendering the application.
- **`App.css`** & **`index.css`**: Global styles for the application.
- **`components/`**: Reusable UI components such as custom selectors, sliders, and tables.
- **`hooks/`**: Custom React hooks for handling app-specific logic.
- **`stores/`**: Context providers for managing application state, such as device models and health status.
- **`styles/`**: Base styling configurations.
- **`types/`**: Type definitions for better TypeScript integration.
- **`utils/`**: Helper functions for communicating with backend. Includes processing and retrieving data.
- **`features/`**: Implementation of different screens, such as login, realtime and history mode screen. The codebase is screen-specific and aims to follow the top-level structure for each screen, mainly introducing `components` and utils folders.

## Usage

### Development environment

Build the docker image
```bash
docker build -t frontend_dev_env -f Dockerfile_frontend_development .
```

Enter the docker container
```bash
docker run --rm -it \
-v .:/react \
-p 3000:3000 \
--entrypoint /bin/bash \
frontend_dev_env
```

Run the application in the docker container
```bash
cd react/app
npm install
npm run dev
```


### Production environment

Build the docker image
```bash
docker build -t frontend_production_env -f Dockerfile_frontend_production .
```

Enter the docker container
```bash
docker run --rm -it -p 3000:3000 frontend_production_env
```

Open the application in the browser `localhost:3000`.
