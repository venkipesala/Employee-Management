FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} employee.jar
ENTRYPOINT ["java","-jar","/app.jar"]
