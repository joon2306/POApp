# PO_APP

## Overview

This is an Electron-based desktop application designed to assist with product ownership and development workflow tasks. It integrates with Jira, provides productivity tools, Kanban boards, and features for PI (Program Increment) planning.

---

## Architecture

The application is built using **Electron**, allowing for the creation of a desktop application with web technologies. The architecture is split into two main processes:

1.  **Main Process (`/main`):** This is the application's backend, running in a Node.js environment. It handles the application lifecycle, interacts with the operating system, manages data, and performs background tasks. It contains the core business logic for all the features.

2.  **Renderer Process (`/renderer`):** This is the application's frontend, built with **Next.js** (a React framework). It is responsible for rendering the user interface and handling all user interactions.

### Inter-Process Communication (IPC)

The `main` and `renderer` processes are isolated and communicate through Electron's **Inter-Process Communication (IPC)** mechanism. A `preload` script (`main/preload.ts`) is used to securely expose specific backend functions and data from the `main` process to the `renderer` process, enabling the frontend to interact with the backend.

---

## Key Features

- **Jira Integration:** Tools for generating and managing Jira items.
- **Kanban Board:** A visual tool for managing tasks and workflows.
- **Productivity Tracking:** Features to monitor and analyze productivity metrics.
- **PI Planning:** Tools to assist with Program Increment planning.
- **Vault:** A secure storage area within the application.
- **AI-Assisted Content:** Features for email generation and English language correction.

---

## Getting Started

### Installation

First, install the project dependencies.

```bash
# Navigate to the project directory
cd PO_APP

# using yarn or npm
yarn
# or
npm install

# using pnpm
pnpm install --shamefully-hoist
```

### Running the Application

You can run the application in development mode or create a production build.

```bash
# To run in development mode
yarn dev

# To create a production build
yarn build
```

---

## Testing

The project uses **Jest** for testing. Test files (`__tests__`) are located alongside the source code in both the `main` and `renderer` directories.