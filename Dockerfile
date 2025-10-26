# -----------------------------
# Stage 1: React 빌드
# -----------------------------
FROM node:18 AS build
WORKDIR /app

# 빌드 시 전달할 ARG 정의 (Render 환경변수 전달)
ARG REACT_APP_API_URL
ARG REACT_APP_KAKAO_KEY
ARG REACT_APP_SERVER_URL

# ARG를 ENV로 설정 (React 빌드 시점에서 인식됨)
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_KAKAO_KEY=$REACT_APP_KAKAO_KEY
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

# 패키지 복사 및 설치
COPY react-frontend/package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY react-frontend/ .
RUN npm run build

# -----------------------------
# Stage 2: Spring 빌드
# -----------------------------
FROM maven:3.9.4-eclipse-temurin-17 AS spring-build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

# React 빌드 결과를 Spring static 폴더로 복사
COPY --from=build /app/build ./src/main/resources/static

# Maven 빌드 (테스트 스킵)
RUN mvn clean package -DskipTests

# -----------------------------
# Stage 3: 실행
# -----------------------------
FROM openjdk:17-jdk-slim
WORKDIR /app

# Spring 빌드 결과 복사
COPY --from=spring-build /app/target/wara-0.0.1-SNAPSHOT.jar ./wara.jar

EXPOSE 8050
CMD ["java", "-jar", "wara.jar"]
