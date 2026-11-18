-- !!! UYARI: SADECE YEREL GELİŞTİRME İÇİN !!!
-- Bu dosya şifresi 123456 olan bir ADMIN hesabı oluşturur.
-- Yayındaki (production) veritabanında ASLA çalıştırma.

-- MovieApp DB Seed (users) - email dahil
-- Hem H2 hem MySQL uyumlu olacak şekilde genel SQL kullanıldı.
-- Not: Spring Security tarafında şifreler BCrypt hash bekler.
-- Bu script'te örnek bcrypt hash kullanılmıştır. (123456)

-- users tablosu alanları (projeye göre):
-- id (auto), username (unique), password (bcrypt), role
-- yeni alan: email (unique)

INSERT INTO users (username, password, role, email) VALUES
  ('user1', '$2a$10$7QkHfO9wq5mJp8r3ZxgkU.5jJwq8pXGQmB5pQv5f5gKxw2dK8a6oG', 'USER', 'user1@example.com'),
  ('user2', '$2a$10$7QkHfO9wq5mJp8r3ZxgkU.5jJwq8pXGQmB5pQv5f5gKxw2dK8a6oG', 'USER', 'user2@example.com'),
  ('admin',  '$2a$10$7QkHfO9wq5mJp8r3ZxgkU.5jJwq8pXGQmB5pQv5f5gKxw2dK8a6oG', 'ADMIN', 'admin@example.com');

