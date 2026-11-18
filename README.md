#  MovieApp: Full-Stack Content Platform

MovieApp is a modern, end-to-end content management platform where users can discover, rate, and manage movies and TV series. The project is built following **Layered Architecture** and **Object-Oriented Programming (OOP)** principles, ensuring industrial standards for code quality, scalability, and maintainability.

##  Key Features

*   **Advanced Data Modeling (Polymorphism):** Implementation of **JPA Joined Inheritance** for `Movie` and `Series` entities inherited from a base `Content` class.
*   **Secure Authentication:** Robust sign-up and login flow integrated with **Spring Security** and **JWT (JSON Web Token)**.
*   **Dual List Management:** Users can independently manage their **Favorites** and **Watchlist**.
*   **Review & Rating System:** Built-in functionality for users to leave comments and rate content on a scale of 1-10.
*   **Dynamic Search:** Real-time search functionality filtered by title using optimized backend queries.
*   **Role-Based Access Control (RBAC):** Distinction between `USER` and `ADMIN` roles, featuring a restricted Admin Panel for content creation and management.
*   **Automatic Seed Data:** Built-in initializer to populate the database with popular titles upon application startup.

##  Tech Stack

*   **Backend:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate
*   **Frontend:** React.js, Vite, CSS3 (Responsive UI), Axios
*   **Database:** MySQL
*   **Tools & Build:** Maven, Git, Postman

---

## Setup Instructions (How to Run)

### 1. Database
Create the database and a user in your local MySQL instance:

```sql
CREATE DATABASE movieapp;
CREATE USER 'movieapp_user'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON movieapp.* TO 'movieapp_user'@'localhost';
```

### 2. Configuration
All secrets are read from environment variables — never write them into `application.properties`.
Copy `.env.example` and fill in the values (see the comments in the file):

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_PASSWORD` | yes | MySQL password |
| `JWT_SECRET` | yes (production) | At least 32 random characters: `openssl rand -base64 48`. If missing, a temporary key is generated and everyone is logged out on restart. |
| `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | for password reset | Gmail address and an App Password |
| `CORS_ALLOWED_ORIGINS` | production | Frontend URL, e.g. `https://example.com` |
| `FRONTEND_RESET_PASSWORD_URL` | production | e.g. `https://example.com/reset-password` |

### 3. Backend
```bash
cd backend
mvn spring-boot:run
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
The app runs at http://localhost:5173 (API calls are proxied to the backend on port 8080).

### 5. Admin account
Register a normal account in the app, then promote it in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your-username';
```

> `db-seed-users-with-email.sql` creates an `admin` / `123456` account — local development only, never run it on a production database.

## Tests

```bash
cd backend && mvn test     # integration tests on an in-memory H2 database (no MySQL needed)
cd frontend && npm run lint
```

## Deployment

1. `cd frontend && npm run build` and copy `frontend/dist` to the web server.
2. Build the backend with `cd backend && mvn package` and run `java -jar target/backend-0.0.1-SNAPSHOT.jar` with the environment variables above. Keep port 8080 closed to the internet.
3. Put Nginx in front of both — see [`deploy/nginx.conf`](deploy/nginx.conf). It forwards `/api` to the backend and serves `index.html` for routes like `/reset-password`. Enable HTTPS (e.g. `certbot --nginx`).

Login, registration and password reset are rate limited per IP. Changing a password logs out all existing sessions.
