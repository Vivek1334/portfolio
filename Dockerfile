FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM eclipse-temurin:21-jdk-alpine AS backend-builder
WORKDIR /app
COPY --from=frontend-builder /app /app
RUN mkdir -p backend/target/classes && \
    javac -encoding UTF-8 -d backend/target/classes backend/src/main/java/com/portfolio/PortfolioServer.java

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=frontend-builder /app/dist ./dist
COPY --from=backend-builder /app/backend/target/classes ./backend/target/classes
EXPOSE 8080
ENV PORT=8080
CMD ["java", "-cp", "backend/target/classes", "com.portfolio.PortfolioServer"]
