# Patient Monitoring System — Main Backend

## Overview

The Main Backend is a core component of a full-stack patient monitoring system designed to support hospital nursing workflows.

The system provides a centralized interface for nurses to access patient-related information and monitoring updates.

This repository contains the main server-side application, built with Node.js and Express. It provides REST API endpoints for patient, nurse, and bed-related data and serves as the primary backend for the frontend and monitoring service.

This repository is part of a larger project composed of three interconnected repositories, working together as a multi-service application.

## System Architecture

The complete system consists of three independent but interconnected components:

- **Frontend:** A React application providing the user interface.
- **Main Backend:** A Node.js and Express server providing REST API endpoints.
- **Monitoring Server:** A separate Node.js service supporting real-time communication through WebSockets.

### Architecture Diagram

```text
                  Hospital Nurses
                         |
                         v
                   React Frontend
                    /          \
                   v            v
              REST API       WebSocket
                   |            |
                   v            v
             Main Backend   Monitoring Server
             Node.js/Express Node.js/Express
                   |
                   v
           Patient-related data
```

## Related Repositories

This project is divided into three repositories:

| Component | Repository | Technology |
|---|---|---|
| Frontend | [client_react_finalProject](https://github.com/shugi-star/client_react_finalProject) | React |
| Main Backend | [server_react_finalProject](https://github.com/shugi-star/server_react_finalProject) | Node.js, Express |
| Monitoring Server | [monitor_demo_react](https://github.com/shugi-star/monitor_demo_react) | Node.js, Express, WebSockets |

## Technologies

- Node.js
- Express.js
- JavaScript
- REST APIs
- MySQL2
- dotenv
- CORS

## Responsibilities

- Handling HTTP requests.
- Providing REST API endpoints.
- Processing patient-, nurse-, and bed-related requests.
- Supporting communication with the frontend.
- Providing patient-related data to the monitoring service.
- Managing server configuration through environment variables.

## Main API Route Groups

| Route | Purpose |
|---|---|
| `/patients` | Patient-related API |
| `/nurse` | Nurse-related API |
| `/beds` | Bed-related API |

## Running the Complete System Locally

The application consists of three services. Each repository must be cloned and run separately.

### Prerequisites

- Node.js and npm installed.
- Git installed.
- MySQL available if required by the application configuration.

### 1. Clone the Repositories

```bash
git clone https://github.com/shugi-star/server_react_finalProject.git
git clone https://github.com/shugi-star/monitor_demo_react.git
git clone https://github.com/shugi-star/client_react_finalProject.git
```

### 2. Configure the Main Backend

Open a terminal in the `server_react_finalProject` directory:

```bash
npm install
```

Create a local `.env` file with the environment variables expected by the application.

Configure the database connection settings if required.

Do not commit passwords, tokens, or other sensitive credentials.

### 3. Start the Main Backend

```bash
npm start
```

The server uses port `3001` by default. A different port can be configured through the `PORT` environment variable.

The local server address is:

```text
http://localhost:3001
```

The root endpoint can be used to verify that the server responds:

```text
http://localhost:3001/
```

It returns:

```text
Final Project Server
```

### 4. Start the Monitoring Server

Open a separate terminal in the `monitor_demo_react` directory:

```bash
npm install
node server.js
```

The monitoring server uses port `3002` by default.

### 5. Start the Frontend

Open another terminal in the `client_react_finalProject` directory:

```bash
npm install
npm start
```

The React development server is typically available at:

```text
http://localhost:3000
```

### Local Services Overview

| Service | Default Port | Local Address |
|---|---:|---|
| Frontend | 3000 | `http://localhost:3000` |
| Main Backend | 3001 | `http://localhost:3001` |
| Monitoring Server | 3002 | `ws://localhost:3002/ws/monitorsRealtime` |

### Integration Configuration

For complete local operation, verify that the API paths, backend URLs, WebSocket endpoint, and CORS settings are consistent across all three repositories.

In particular, the patient endpoint used by the monitoring service should match the route exposed by the Main Backend.

## Project Context

The Main Backend is part of the **Patient Monitoring System**, a multi-service application demonstrating backend development, REST API design, database integration, and communication between independent application components.
