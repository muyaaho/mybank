# MyBank 360 - Modern Fintech Platform

A cloud-native, microservices-based fintech platform built with **Spring Boot 3**, **Spring Cloud**, **Kafka**, **MongoDB**, and **Next.js**. This platform implements **MSA (Microservices Architecture)** and **EDA (Event-Driven Architecture)** patterns for high scalability and performance.

## Architecture Overview

```
┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │ http://localhost:3000
       │
┌──────▼───────────────────────────────────────────────────────┐
│                       API Gateway (8080)                      │
│              JWT Authentication & Routing                      │
└────────────┬─────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬──────────┬──────────┬──────────┐
    │                 │          │          │          │
┌───▼────┐  ┌────▼─────┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐
│  Auth  │  │   PFM    │  │Payment│  │Invest│  │ ...  │
│Service │  │ Service  │  │Service│  │Service│  │      │
│        │  │          │  │       │  │      │  │      │
│:8081   │  │  :8082   │  │ :8083 │  │:8084 │  │      │
└────────┘  └────┬─────┘  └───┬───┘  └──┬───┘  └──────┘
                 │            │         │
                 └────────┬───┴─────────┘
                          │
                    ┌─────▼─────┐
                    │   Kafka   │
                    │  Events   │
                    └───────────┘
```

## Core Features

### 1. Personal Financial Management (PFM)
- **Unified Asset View**: Aggregate accounts from banks, cards, securities, insurance
- **AI-Powered Spending Analysis**: Automatic transaction categorization and anomaly detection
- **Redis Caching**: Cache-Aside pattern for real-time balance queries

### 2. Investment Services
- **Micro-Investing**: Invest in stocks/ETFs starting from 1,000 KRW
- **Round-Up Investing**: Automatically invest spare change from payments
- **Event-Driven**: Consumes payment events via Kafka for automatic investing

### 3. Payment & Transfers
- **Ultra-Simple Transfers**: FIDO2 biometric authentication
- **Subscription Management**: Auto-pay for telecom, OTT, utilities
- **Event Publishing**: Publishes payment events to Kafka

### 4. Authentication & Security
- **OAuth 2.0 & JWT**: Centralized authentication
- **Account Lockout**: Protection against brute-force attacks
- **Redis Session**: Distributed session management

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Architecture** | MSA, EDA | Service independence, async communication |
| **Frontend** | Next.js 14, React, TypeScript | Modern web application |
| **Backend** | Spring Boot 3.2, Spring Cloud 2023 | Microservices framework |
| **Service Discovery** | Eureka | Service registry |
| **API Gateway** | Spring Cloud Gateway | Request routing, JWT validation |
| **Main DB** | MongoDB, PostgreSQL | Flexible schema (PFM), ACID transactions (Auth) |
| **Cache** | Redis Cluster | Session, rankings, real-time data |
| **Messaging** | Apache Kafka | Event streaming, EDA implementation |
| **Monitoring** | Prometheus, Grafana | Metrics collection, visualization |
| **Container** | Docker, Docker Compose | Local development |
| **Orchestration** | Kubernetes (Kind) | Production deployment |

## Project Structure

```
my-bank/
├── app/                       # Frontend (Next.js)
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # API client, utilities
│   ├── stores/               # State management
│   └── types/                # TypeScript types
├── api-gateway/              # API Gateway (Port 8080)
├── config-server/            # Config Server (Port 8888)
├── service-discovery/        # Eureka Server (Port 8761)
├── auth-service/             # Authentication (Port 8081)
├── pfm-core-service/         # Personal Financial Management (Port 8082)
├── payment-service/          # Payment & Transfers (Port 8083)
├── investment-service/       # Investing & Round-up (Port 8084)
├── common-lib/               # Shared utilities, DTOs, configs
├── k8s/                      # Kubernetes manifests
├── docker/                   # Docker configs
└── docker-compose.yml        # Local development
```

## Getting Started

### Prerequisites

- **Java 21** or higher
- **Docker** and **Docker Compose**
- **Gradle 8.x**

### 1. Start Infrastructure Services

```bash
# Start all infrastructure services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f kafka
```

**Services Started:**
- PostgreSQL: `localhost:5432`
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`
- Kafka: `localhost:9092`
- Kafka UI: `http://localhost:8090`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (admin/admin)

### 2. Build the Project

```bash
# Build all modules
./gradlew clean build

# Skip tests for faster build
./gradlew clean build -x test
```

### 3. Start Microservices

**Start services in order:**

```bash
# 1. Service Discovery (wait for startup)
./gradlew :infrastructure:service-discovery:bootRun

# 2. Config Server (wait for registration)
./gradlew :infrastructure:config-server:bootRun

# 3. API Gateway (wait for registration)
./gradlew :infrastructure:api-gateway:bootRun

# 4. Business Services (can start in parallel)
./gradlew :services:auth-service:bootRun
./gradlew :services:pfm-core-service:bootRun
./gradlew :services:payment-service:bootRun
./gradlew :services:investment-service:bootRun
```

### 4. Verify Services

```bash
# Check Eureka Dashboard
open http://localhost:8761

# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check service health
curl http://localhost:8081/auth/health
curl http://localhost:8082/pfm/health
curl http://localhost:8083/payment/health
curl http://localhost:8084/invest/health
```

## API Examples

### 1. User Registration

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@mybank.com",
    "password": "MyBank123!",
    "name": "John Doe",
    "phoneNumber": "010-1234-5678"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@mybank.com",
    "password": "MyBank123!"
  }'
```

### 3. Get Assets (with JWT)

```bash
curl http://localhost:8080/api/v1/pfm/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Transfer Money

```bash
curl -X POST http://localhost:8080/api/v1/payment/transfer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "account-123",
    "toAccountId": "account-456",
    "recipientName": "Jane Doe",
    "amount": 50000,
    "description": "Dinner payment"
  }'
```

### 5. Get Investment Summary

```bash
curl http://localhost:8080/api/v1/invest/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Event Flow: Round-Up Investing

```
1. User makes payment of 3,450 KRW
   ↓
2. Payment Service completes transaction
   ↓
3. Publishes "PaymentCompletedEvent" to Kafka topic "payment-completed"
   ↓
4. Investment Service consumes event
   ↓
5. Calculate round-up: 4,000 - 3,450 = 550 KRW
   ↓
6. Automatically invest 550 KRW in round-up account
   ↓
7. Update investment balance and statistics
```

## Monitoring

### Prometheus Metrics
Visit `http://localhost:9090`

### Grafana Dashboards
1. Open `http://localhost:3001` (admin/admin)
2. Add Prometheus data source: `http://prometheus:9090`
3. Import dashboard ID: 4701 (JVM Micrometer)

### Kafka UI
Monitor topics at `http://localhost:8090`

## Frontend Application

### Features
- 🔐 **Authentication**: Login/Register with JWT
- 📊 **Dashboard**: Asset summary with charts
- 💰 **Spending Analysis**: Category breakdown and anomaly detection
- 📈 **Investment**: Round-up investing and portfolio tracking
- 💳 **Payment**: Account transfers and transaction history

### Quick Start

#### Option 1: Docker Compose (Recommended)

```bash
# Start all services including frontend
docker-compose up -d

# Access frontend
open http://localhost:3000
```

#### Option 2: Local Development

```bash
# Fix npm cache permissions if needed
sudo chown -R $(whoami) ~/.npm

# Install dependencies
cd app
npm install

# Run development server
npm run dev

# Access frontend
open http://localhost:3000
```

#### Option 3: Kubernetes (Kind)

```bash
# Build all images and deploy
./kind-deploy-all.sh

# Access frontend via NodePort
open http://localhost:30000
```

### Frontend Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Query**: Server state management
- **Zustand**: Client state management
- **Recharts**: Data visualization

See [FRONTEND_DEPLOYMENT.md](./FRONTEND_DEPLOYMENT.md) for detailed deployment instructions.

## Deployment

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Kubernetes (Kind)

```bash
# Build and deploy everything
./kind-deploy-all.sh

# Access services
Frontend:         http://localhost:30000
API Gateway:      http://localhost:8080
Eureka Dashboard: http://localhost:8761
Kafka UI:         http://localhost:8090

# View pods
kubectl get pods -n mybank

# View logs
kubectl logs -f deployment/frontend -n mybank

# Clean up
./undeploy-kind.sh
```

## Testing the Platform

### 1. Create an Account

Open http://localhost:3000 (or :30000 for Kind) and register:
- Email: test@mybank.com
- Password: MyBank123!
- Name: 홍길동
- Phone: 010-1234-5678

### 2. Explore Features

After login, you'll see:
- **Dashboard**: View your assets and category breakdown
- **지출 분석**: Analyze spending patterns
- **투자**: Track investment portfolio and round-up investing
- **송금**: Transfer money between accounts

### 3. Test Round-Up Investing

1. Go to 송금 (Payment) page
2. Make a transfer (e.g., 15,300 KRW)
3. Go to 투자 (Investment) page
4. See automatic round-up investment (200 KRW to reach 15,500)

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh

### PFM Endpoints

- `GET /api/v1/pfm/assets` - Get asset summary
- `GET /api/v1/pfm/spending/analysis?daysBack=30` - Get spending analysis

### Payment Endpoints

- `POST /api/v1/payment/transfer` - Execute transfer
- `GET /api/v1/payment/{paymentId}` - Get payment details

### Investment Endpoints

- `GET /api/v1/invest/summary` - Get investment summary

## License

MIT License