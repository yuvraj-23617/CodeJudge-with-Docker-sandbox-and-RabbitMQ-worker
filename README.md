# CodeJudge

A distributed online coding assessment platform built with **Java Spring Boot**, designed to evaluate programming submissions asynchronously using **RabbitMQ**, **Docker**, and **PostgreSQL**. The platform supports secure user authentication, multi-language code execution, automated test case evaluation, and containerized deployment.

---

## Features

### User Management
- User Registration
- User Login
- BCrypt Password Encryption
- Role-based Authentication (Admin/User)

### Problem Management
- Create Coding Problems
- View All Problems
- View Problem Details
- Public & Hidden Test Cases

### Code Evaluation
- Multi-language Support
  - Python
  - Java
  - C++
- Docker-based Secure Sandbox
- Automated Test Case Validation
- Execution Time Measurement
- Verdict Generation
  - Accepted
  - Wrong Answer
  - Runtime Error
  - Compilation Error
  - Time Limit Exceeded
  - Pending

### Architecture
- RESTful API Design
- Asynchronous Processing using RabbitMQ
- Producer-Consumer Judging Pipeline
- PostgreSQL Database
- Docker Compose Deployment

---

# Tech Stack

| Category | Technology |
|-----------|------------|
| Language | Java 17 |
| Framework | Spring Boot |
| Security | Spring Security, BCrypt |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Messaging | RabbitMQ |
| Code Execution | Docker |
| Build Tool | Gradle |
| API Testing | Postman |
| Deployment | Docker Compose |

---

# System Architecture

```
                    Client / Postman
                           │
                           ▼
                 Spring Boot REST API
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
 Authentication      Problem Service     Submission Service
      │                    │                    │
      └────────────────────┼────────────────────┘
                           │
                           ▼
                    RabbitMQ Queue
                           │
                           ▼
                     Judge Worker
                           │
                           ▼
                  Docker Code Sandbox
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
         Python          Java           C++
                           │
                           ▼
                   Verdict Generation
                           │
                           ▼
                      PostgreSQL
```

---

# Submission Workflow

1. User submits source code.
2. Submission is stored in PostgreSQL with status **PENDING**.
3. Submission ID is published to RabbitMQ.
4. Judge Worker consumes the message.
5. Code executes inside an isolated Docker container.
6. Output is compared against public and hidden test cases.
7. Execution time is recorded.
8. Verdict is stored in PostgreSQL.
9. Client polls the submission endpoint until the final verdict is available.

---

# Project Structure

```
CodeJudge
│
├── src
│   ├── config
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── security
│   └── service
│
├── Dockerfile
├── docker-compose.yml
├── build.gradle
└── README.md
```

---

# API Endpoints

## Authentication

### Register

```
POST /users/register
```

Request

```json
{
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
}
```

---

### Login

```
POST /users/login
```

Request

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

---

## Problems

### Get All Problems

```
GET /problems
```

---

### Get Problem

```
GET /problems/{id}
```

---

### Create Problem

```
POST /problems
```

---

## Submissions

### Submit Code

```
POST /submit
```

Example

```json
{
    "problemId": 1,
    "language": "python",
    "code": "print('Hello World')"
}
```

---

### Get Submission

```
GET /submissions/{id}
```

---

# Supported Languages

- Python
- Java
- C++

---

# Running the Project

## Prerequisites

- Java 17
- Docker Desktop
- Git

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/CodeJudge.git

cd CodeJudge
```

---

## Start Docker

Ensure Docker Desktop is running.

---

## Run the Project

```bash
docker compose up --build
```

The following services will start automatically:

- Spring Boot
- PostgreSQL
- RabbitMQ

---

## Access Services

Spring Boot

```
http://localhost:8080
```

RabbitMQ Dashboard

```
http://localhost:15672
```

Default Credentials

```
Username : guest
Password : guest
```

---

## Stop the Project

```bash
docker compose down
```

---

# Future Improvements

- JWT Authentication
- React Frontend
- Monaco Code Editor
- Live Verdict Updates using WebSockets
- Contest Mode
- Leaderboards
- User Profiles
- Submission History
- Redis Caching
- Multiple Judge Workers
- Kubernetes Deployment
- CI/CD with GitHub Actions

---

# Highlights

- Multi-language Online Judge
- Secure Docker Sandbox Execution
- Asynchronous RabbitMQ-based Processing
- Role-based User Authentication
- Containerized Deployment
- RESTful API Architecture
- Layered Spring Boot Design

---

# Author

**Yuvraj Verma**

B.Tech Computer Science and Biosciences  
IIIT-Delhi
