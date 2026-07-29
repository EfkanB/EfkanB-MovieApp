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

Follow these steps to run the project locally on your machine.

### 1. Database Setup
First, create the database in your local MySQL instance:

```sql
CREATE DATABASE movieapp;
2. Backend Configuration & Execution
Update the backend/src/main/resources/application.properties file with your local MySQL credentials (spring.datasource.username and password).

Open your terminal, navigate to the backend directory, and run the Spring Boot application:

Bash
cd backend
mvn spring-boot:run
3. Frontend Configuration & Execution
Open a new terminal, navigate to the frontend directory, install the required dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
Note: The frontend application will be accessible by default at http://localhost:5173.
