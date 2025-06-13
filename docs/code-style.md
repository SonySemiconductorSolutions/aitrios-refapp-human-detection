# Running style/formatting checks included in the Human Detection Sample Application

This guide will help you how to run the application included in the project. We will also explain how to ensure style and formatting rules.

## How to run the application
You can find the instructions on how to run the Human Detection Sample Application [here](./USAGE.md#how-to-run).

The instructions on how to debug both frontend and backend are [here](USAGE.md#debugging).

### Code Formatting
This repository enforces code formatting for both the backend and frontend. Ensuring proper formatting helps maintain code quality and prevents unnecessary changes.

#### Backend Formatting
Formatting on the Backend is done through the `pre-commit` library, which needs to be installed in your repository to maintain code quality and formatting consistency.

**Installation**

First, activate your virtual environment (if applicable), then install `pre-commit`:
```bash
pip install pre-commit
```

Then, navigate to the root folder of this repository, and run:

```bash
pre-commit install
```

This setup automatically runs `pre-commit` before each commit, preventing CI failures due to formatting issues.

**Running Pre-commit Manually (Optional)**

You can force pre-commit to run in all files of the repository by running the following:

```bash
pre-commit run --all-files
```

This is not typically required but can be useful after the initial installation to ensure all files are correctly formatted.

#### Frontend Formatting
Formatting on the Frontend is done through the `prettier` library, which can be executed using NPM scripts run from the `/frontend/app` folder.

- Run a check (without modifying anything) on the format of all frontend files: `npm run format:check`.
- Apply formatting to all frontend files: `npm run format`.
