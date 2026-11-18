# MovieApp: frontend + backend tek imaj
# 1) React derlenir, 2) çıktısı Spring Boot'un static klasörüne konup jar üretilir, 3) sadece JRE ile çalışır.

# ---------- 1. Frontend ----------
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---------- 2. Backend ----------
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn -q -B dependency:go-offline
COPY backend/src ./src
COPY --from=frontend /app/frontend/dist ./src/main/resources/static
RUN mvn -q -B -DskipTests package

# ---------- 3. Çalıştırma ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=backend /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
USER app
# Render free 512 MB bellek veriyor; JVM'in buna sığması için yüzdeyle sınırla
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
