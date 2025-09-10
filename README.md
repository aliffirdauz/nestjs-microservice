# Fullstack Challenge Solution

## 📦 Tech Stack
- [NestJS](https://nestjs.com/) (microservices)
- [PostgreSQL](https://www.postgresql.org/) (database)
- [Redis](https://redis.io/) (cache / queue helper)
- [RabbitMQ](https://www.rabbitmq.com/) (message broker)
- [Docker Compose](https://docs.docker.com/compose/) (orchestration)

---

## 🚀 Cara Jalanin Project

### 1. Clone Repository
```bash
git clone <repo-url>
cd fullstack-challenge
```

### 2. Jalankan Docker Compose
```bash
docker compose up -d --build
```

### 3. Services yang Tersedia
- **User Service** → http://localhost:3000
- **Order Service** → http://localhost:3001
- **RabbitMQ Management** → http://localhost:15672 (user: guest / pass: guest)
- **Postgres** → localhost:5432 (db: postgres / user: postgres / pass: postgres)
- **Redis** → localhost:6379

---

## 📌 API Endpoints

### User Service (Port 3000)
- `POST /users` → Create user
- `GET /users/:id` → Get user by ID

### Order Service (Port 3001)
- `POST /orders` → Create order
- `GET /orders/user/:userId` → Get all orders by user ID

---

## 🔗 Postman Collection
File `fullstack_challenge_postman_collection.json` tersedia di repo.  
Import ke Postman untuk langsung coba endpoint-endpoint di atas.

---

## 🧩 Arsitektur Microservices
- **User Service** menyimpan data user ke Postgres dan emit event `user.created` ke RabbitMQ.
- **Order Service** subscribe ke event `user.created` dan menyimpan order ke Postgres.
- **Redis** bisa digunakan untuk caching / session.

---

## 🧪 Testing (Opsional)
Jalankan unit test dengan:
```bash
npm run test
```

---

## ✅ Checklist Fitur
- [x] User Service: Create & Get User
- [x] Order Service: Create & Get Orders by User
- [x] Event bus dengan RabbitMQ (user.created → order service)
- [x] PostgreSQL & Redis terintegrasi
- [x] Docker Compose untuk semua services
- [x] Postman Collection untuk testing
