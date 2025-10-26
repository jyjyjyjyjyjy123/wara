# Stage 1: React 빌드
FROM node:18 AS build
WORKDIR /app
COPY react-frontend/package*.json ./
RUN npm install
COPY react-frontend/ .
RUN npm run build

# Stage 2: Spring 빌드
FROM maven:3.9.2-openjdk-17 AS spring-build
WORKDIR /app
COPY pom.xml mvnw ./
COPY mvnw.cmd ./
COPY src ./src
COPY --from=build /app/build ./src/main/resources/static
RUN ./mvnw clean package -DskipTests

# Stage 3: 실행
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=spring-build /app/target/wara-0.0.1-SNAPSHOT.jar ./wara.jar
EXPOSE 8050
CMD ["java", "-jar", "wara.jar"]
