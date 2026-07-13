# CodeJudge

A containerized online coding judge platform that supports Python, Java, and C++ with isolated execution in Docker.

---

## Overview

CodeJudge provides a complete environment for coding problem solving and automated evaluation. It accepts submissions in multiple languages, executes them inside ephemeral Docker containers, and returns verdicts such as ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, or TIME_LIMIT_EXCEEDED. The system is designed for local use, demonstration, and educational purposes.

---

## Features

- Multi-language support: Python, Java, C++
- Docker-based execution with memory and CPU limits
- Asynchronous judging via RabbitMQ
- 12 pre-loaded problems with visible and hidden test cases
- Admin panel for managing problems and test cases
- Monaco Editor for code input
- Submission history stored in the browser
- Fully containerised with Docker Compose
- One-click startup scripts for Windows

---

## Technology Stack

| Component        | Technology                         |
|------------------|------------------------------------|
| Backend          | Spring Boot 4, Hibernate, Spring Security |
| Database         | PostgreSQL 16                      |
| Message Queue    | RabbitMQ 3                         |
| Frontend         | HTML, CSS (Tailwind), JavaScript   |
| Code Editor      | Monaco Editor                      |
| Execution Engine | Docker (Docker-in-Docker pattern)  |
| Proxy            | Nginx                              |
| Build Tool       | Gradle                             |
| Containerisation | Docker Compose                     |

---

## Getting Started

### Prerequisites

- Docker Desktop (or Docker Engine + Compose) installed and running
- Ports 8080 and 8081 must be available

### Startup Instructions (Windows)

1. Extract the project archive.
2. Double-click `START_CODEJUDGE.bat`.
3. Wait for the build and startup process to complete (first run may take 3–5 minutes).
4. The application will open automatically in your default browser at `http://localhost:8081`.

### Startup Instructions (Linux / macOS)

```bash
docker compose up -d --build
```

Then open `http://localhost:8081` in your browser.

### Shutdown

- Windows: Double-click `STOP_CODEJUDGE.bat`
- Linux / macOS: `docker compose down`

---

## Credentials

- **Admin account**: `admin` / `admin123`
- **User accounts**: Register via the login page (no email verification required)

The admin account is created automatically when the application starts with an empty database.

---

## Project Structure

```
CodeJudge/
├── src/                     Backend source code (Spring Boot)
├── Frontend/                Frontend static files and Nginx configuration
├── docker-compose.yml       Service definitions
├── Dockerfile               Backend container build
├── Frontend/Dockerfile      Frontend container build
├── .env                     Environment variables (credentials)
├── START_CODEJUDGE.bat      Windows startup script
├── STOP_CODEJUDGE.bat       Windows shutdown script
├── build.gradle             Gradle build configuration
└── README.md                This file
```

---

## Notes for Users

- The application is intended for **local demo and educational use only**.
- It is not hardened for public internet deployment.
- Memory usage reporting is currently a placeholder and will be improved in future versions.
- Hidden test cases are not exposed to the frontend, but their expected outputs are currently included in the API response for simplicity. This will be addressed in a later release.

---

## Contributing

This project is part of a mentorship handoff. Contributions, suggestions, and feedback are welcome via issues or pull requests.

---

## License

This project is provided for educational and demonstration purposes. All rights reserved by the author unless otherwise stated.
