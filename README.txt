MovieApp; kullanıcıların film ve dizileri keşfedebileceği, kişisel listeler oluşturabileceği ve içerikleri değerlendirebileceği, uçtan uca modern teknolojilerle geliştirilmiş bir içerik yönetim platformudur. Proje; **Katmanlı Mimari (Layered Architecture)** ve **Nesne Yönelimli Programlama (OOP)** prensipleri temel alınarak, yüksek kod kalitesi ve ölçeklenebilirlik hedeflenerek inşa edilmiştir.

## Öne Çıkan Özellikler

- **Gelişmiş Veri Modeli (Polymorphism):** `Content` ana sınıfından türetilen `Movie` ve `Series` yapıları ile veritabanında **JPA Joined Inheritance** stratejisi uygulanmıştır.
- **Güvenli Kimlik Doğrulama:** Spring Security ve **JWT (JSON Web Token)** kullanılarak güvenli kayıt/giriş mekanizması kurgulanmıştır.
- **Çift Liste Yönetimi:** Kullanıcılar içerikleri bağımsız olarak hem **Favorilerine** hem de **İzleme Listelerine (Watchlist)** ekleyebilir.
- **Review & Rating Sistemi:** İçeriklere 1-10 arası puan verme ve yorum yapma imkanı.
- **Dinamik Arama:** Backend tarafında optimize edilmiş sorgularla başlığa göre anlık arama desteği.
- **Rol Bazlı Yetkilendirme (RBAC):** `USER` ve `ADMIN` rolleri ile yetki kontrolü. Admin kullanıcılar için özel içerik yönetim paneli.
- **Seed Data:** Uygulama ayağa kalktığında otomatik olarak popüler içerikleri yükleyen başlangıç verisi yapılandırması.

##  Kullanılan Teknolojiler

- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate.
- **Frontend:** React.js, Vite, CSS3 (Responsive UI), Axios.
- **Veritabanı:** MySQL.
- **Araçlar:** Maven, Git, Postman.

---

##  Kurulum ve Çalıştırma (How to Run)

### 1. Veritabanı Hazırlığı
MySQL üzerinde aşağıdaki komutla veritabanını oluşturun:
```sql
CREATE DATABASE movieapp;
2. Backend Yapılandırması
backend/src/main/resources/application.properties dosyasındaki spring.datasource.username ve password alanlarını kendi MySQL bilgilerinizle güncelleyin.

Terminalden backend klasörüne gidin:

Bash
mvn spring-boot:run
3. Frontend Yapılandırması
frontend klasörüne gidin, bağımlılıkları yükleyin ve projeyi başlatın:

Bash
npm install
npm run dev
Uygulama varsayılan olarak http://localhost:5173 adresinde çalışacaktır.

 MovieApp Full-Stack Content Platform (English)
MovieApp is a modern, end-to-end content management platform where users can discover, rate, and manage movies and TV series. The project is built following Layered Architecture and Object-Oriented Programming (OOP) principles, ensuring industrial standards for code quality and maintainability.

 Key Features
Advanced Data Modeling (Polymorphism): Implementation of JPA Joined Inheritance for Movie and Series entities inherited from a base Content class.

Secure Authentication: Robust sign-up/login flow integrated with Spring Security and JWT (JSON Web Token).

Dual List Management: Independent management of Favorites and Watchlist for each user.

Review & Rating System: Ability to leave comments and rate content on a scale of 1-10.

Dynamic Search: Real-time search functionality filtered by title using optimized backend queries.

Role-Based Access Control (RBAC): Distinction between USER and ADMIN roles, featuring a restricted Admin Panel for content creation.

Automatic Seed Data: Built-in initializer to populate the database with popular titles upon application startup.

 Tech Stack
Backend: Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate.

Frontend: React.js, Vite, CSS3, Axios.

Database: MySQL.

Build & Tools: Maven, Git, Postman.

 Setup Instructions
1. Database Setup
Create a database in your local MySQL instance:

SQL
CREATE DATABASE movieapp;
2. Running the Backend
Update backend/src/main/resources/application.properties with your MySQL credentials.

Navigate to the backend directory and run:

Bash
mvn spring-boot:run
3. Running the Frontend
Navigate to the frontend directory, install dependencies, and start the development server:

Bash
npm install
npm run dev
The application will be accessible at http://localhost:5173.