# Patient Monitoring System

## Overview

A full-stack patient monitoring system designed to help hospital nurses view patients' monitor data in real time through a centralized interface.

The goal of the system is to make patient monitoring information accessible to nurses through a user-friendly interface, helping them view patient-related information and receive real-time monitoring updates.

The system consists of three interconnected components:

- **Frontend:** A React application that provides the user interface for viewing patient information and monitoring data.
- **Main Backend:** A Node.js and Express server that provides API endpoints for patient, nurse, and bed-related data.
- **Monitoring Server:** A separate Node.js service that uses WebSockets to support real-time monitoring updates.

Together, these components demonstrate a multi-service architecture that combines frontend development, REST API integration, and real-time communication.

## System Architecture

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
          Node.js/Express  Node.js/Express
                |
                v
        Patient-related data
```

## Technologies

- Node.js
- Express.js
- JavaScript
- REST APIs
- MySQL-related dependencies
- dotenv
- CORS
- bcrypt and JSON Web Token (JWT) dependencies

## Main Backend — This Repository

This repository contains the main backend service.

It provides API endpoints for patient-, nurse-, and bed-related data and serves as a central backend component for the React frontend and the monitoring service.

### Responsibilities

- Handling HTTP requests.
- Providing REST API endpoints.
- Processing requests related to patients, nurses, and beds.
- Supporting communication between the frontend and backend services.
- Managing server configuration through environment variables where applicable.

### Main API Route Groups

| Route | Purpose |
|---|---|
| `/patients` | Patient-related API |
| `/nurse` | Nurse-related API |
| `/beds` | Bed-related API |

The exact operations supported by each route depend on the implementation.

## Running Locally

### Prerequisites

- Node.js and npm installed.
- The repository cloned to your computer.
- Any required database services and environment variables configured, if applicable.

### 1. Install Dependencies

Open a terminal in the `server_react_finalProject` directory and run:

```bash
npm install
```

### 2. Configure Environment Variables

If the application requires environment variables, create a local `.env` file using the variable names expected by the code.

Do not commit real passwords, tokens, or secret keys to GitHub.

If a database is required, make sure it is running and that the local connection settings are correct.

### 3. Start the Backend

Run:

```bash
npm start
```

The server uses port `3001` by default, unless a different port is configured through the `PORT` environment variable.

The local server address is typically:

```text
http://localhost:3001
```

### 4. Verify the Server

Open the following address in your browser:

```text
http://localhost:3001/
```

The root endpoint is configured to return:

```text
Final Project Server
```

## Integration with the Other Components

The main backend provides data to the frontend and is also used by the monitoring service to retrieve patient-related information.

For local development, make sure that the frontend and monitoring server use the correct backend URL.

## Future Improvements

- Document API requests and responses.
- Add automated API tests.
- Improve error handling.
- Document database setup and configuration.
- Improve authentication and authorization documentation where applicable.
- Separate development and production configuration.

## Project Context

This repository demonstrates backend development, REST API design, and integration between multiple services in a patient monitoring application concept for hospital nursing workflows.
