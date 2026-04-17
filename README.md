# Microservices Task Manager (Dockerized)

## Architecture

Client → Gateway → Business Service → PostgreSQL

* **Gateway**: Handles routing + JWT authentication
* **Business Service**: Handles auth & task CRUD
* **PostgreSQL**: Database (Docker container)

---

## Tech Stack

* Node.js (Express)
* PostgreSQL
* Docker & Docker Compose
* JWT Authentication

---

##  How to Run

```bash
docker compose up --build
```

---

##  APIs

### Auth

* `POST /auth/register`
* `POST /auth/login`

### Tasks (Protected)

* `POST /tasks`
* `GET /tasks`
* `GET /tasks/:id`
* `PUT /tasks/:id`
* `DELETE /tasks/:id`

---

##  Example

```json
POST /auth/register
{
  "username": "admin",
  "password": "admin123"
}
```

---

##  Key Features

* Dynamic route registration (service discovery)
* JWT-based authentication
* Dockerized microservices architecture
* Internal service communication using Docker network

---

## Notes

* No need for local PostgreSQL
* Database initializes automatically
