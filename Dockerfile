# Stage 1: Build the JAR
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

COPY src src
RUN ./gradlew bootJar --no-daemon

# Stage 2: Runtime image
FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache docker-cli netcat-openbsd curl

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
RUN mkdir -p /judge/workspace

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]