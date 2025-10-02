# Étape 1 : build avec Maven + JDK 17
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app

# Copier les fichiers
COPY pom.xml .
COPY src ./src

# Forcer Maven à utiliser Java 17
RUN mvn clean package -DskipTests

# Étape 2 : exécution avec JDK 17
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copier le jar compilé
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
