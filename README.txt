#  MovieApp Full Stack Application

Bu proje, başlangıçta statik bir HTML/CSS MovieApp tanıtım sayfası iken güncellenerek tam çalışır bir React + Spring Boot + MySQL uygulamasına dönüştürüldü. 
Modern yazılım mühendisliği standartlarına uygun olarak Katmanlı Mimari (Layered Architecture) ve Nesne Yönelimli Programlama (OOP) prensipleri ile geliştirilmiştir.

## 🇹🇷 Uygulamanın Özellikleri
- **Kullanıcı Sistemi:** Kayıt olma ve giriş yapma (JWT tabanlı token doğrulama).
- **Genişletilmiş İçerik Yönetimi (Polymorphism):** `Content` ana sınıfından türeyen `Movie` (Film) ve `Series` (Dizi) desteği.
- **Çift Liste Yönetimi:** Kullanıcılar içerikleri hem **Favorilerine** hem de **İzleme Listelerine (Watchlist)** ekleyebilir/çıkarabilir.
- **Puanlama ve Yorum (Review):** İçeriklere 1-10 arası puan verip yorum yapabilme özelliği.
- **Rol Bazlı Yetkilendirme (Role-Based Auth):** `USER` ve `ADMIN` rolleri.
- **Admin Paneli:** Sadece yetkili kullanıcıların yeni içerik (film/dizi) ekleyebilmesi için güvenli endpointler.
- **Frontend Yönetimi:** Vite proxy ile `/api` çağrılarının backend'e güvenli yönlendirilmesi ve React state yönetimi.

##  Kullanılan Teknolojiler
- **Frontend:** React, Vite, CSS
- **Backend:** Java, Spring Boot 3, Spring Data JPA, Spring Security (JWT)
- **Veritabanı:** MySQL
- **Proje Yapılandırması:** Maven

---

##  Kurulum ve Çalıştırma (How to Run)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Veritabanı Hazırlığı (MySQL)
Öncelikle MySQL üzerinde boş bir veritabanı oluşturun:
```sql
CREATE DATABASE movieapp;
2. Backend'i Çalıştırma (Spring Boot)
backend/src/main/resources/application.properties dosyasını açın.

MySQL username ve password bilgilerinizi kendi bilgisayarınıza göre güncelleyin.

Terminali açıp backend klasörüne gidin ve projeyi başlatın:

Bash
cd backend
mvn spring-boot:run
(Not: Tablolar ddl-auto=update sayesinde veritabanında otomatik olarak oluşturulacaktır.)

3. Frontend'i Çalıştırma (React)
Yeni bir terminal açıp frontend klasörüne gidin ve bağımlılıkları yükleyip projeyi başlatın:

Bash
cd frontend
npm install
npm run dev
Uygulama http://localhost:5173 adresinde çalışmaya başlayacaktır.

 MovieApp Full Stack Application (English)
This project started as a static HTML/CSS MovieApp landing page and was upgraded into a fully working, robust React + Spring Boot + MySQL application.
It is built using Layered Architecture and Object-Oriented Programming (OOP) principles to meet modern software engineering standards.

 Features
Authentication: User registration and login with JWT-based secure authentication.

Advanced Content System (Polymorphism): Supports both Movie and Series inherited from a base Content entity using JPA JOINED strategy.

Dual List Management: Users can add content to both their Favorites and Watchlist independently.

Review System: Users can rate content (1-10) and leave comments.

Role-Based Authorization: Built-in USER and ADMIN roles.

Admin Panel: Secure endpoints allowing only admins to create or manage movies and series.

Frontend Flow: React state management with Vite proxy configuration routing to /api.

 Technologies Used
Frontend: React, Vite, CSS

Backend: Java, Spring Boot 3, Spring Data JPA, Spring Security (JWT)

Database: MySQL

Build Tool: Maven

 How to Run (Setup Instructions)
Follow these steps to run the project locally on your machine:

1. Database Setup (MySQL)
First, create an empty database in your MySQL server:

SQL
CREATE DATABASE movieapp;
2. Running the Backend (Spring Boot)
Navigate to backend/src/main/resources/application.properties.

Update the database username and password with your local MySQL credentials.

Open a terminal, navigate to the backend folder, and run the application:

Bash
cd backend
mvn spring-boot:run
(Note: Hibernate will automatically generate all necessary tables using the ddl-auto=update configuration.)

3. Running the Frontend (React)
Open a new terminal window, navigate to the frontend folder, install dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
The application will be accessible at http://localhost:5173.