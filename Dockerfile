FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew bootJar

EXPOSE 8080

CMD ["java","-jar","build/libs/CodeJudge-0.0.1-SNAPSHOT.jar"]