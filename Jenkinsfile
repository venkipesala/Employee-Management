pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    environment {
        AWS_REGION = 'ap-south-1'
        CLUSTER    = 'ecs-cluster'
        SERVICE    = 'employee-task-service-pio1exln'
        TASK_FAMILY = 'employee-task'
        ECR_REPO = '315974965922.dkr.ecr.ap-south-1.amazonaws.com/employee-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    credentialsId: 'github-cred',
                    url: 'https://github.com/venkipesala/Employee.git'
            }
        }

        stage('Build & Push Image (Jib → ECR)') {
            steps {
                sh '''
                  echo "Logging into ECR..."

                  aws ecr get-login-password --region $AWS_REGION \
                  | docker login \
                    --username AWS \
                    --password-stdin 315974965922.dkr.ecr.ap-south-1.amazonaws.com

                  echo "Building & Pushing Image...$ECR_REPO:$IMAGE_TAG"

                  mvn clean compile jib:build \
                    -Djib.to.image=$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Create New Task Definition') {
            steps {
                sh '''
                  echo "Downloading current task definition..."

                  aws ecs describe-task-definition \
                    --task-definition $TASK_FAMILY \
                    --region $AWS_REGION \
                    > task-def.json


                  echo "Replacing image tag..."

                  cat task-def.json \
                  | jq '.taskDefinition
                    | del(
                      .taskDefinitionArn,
                      .revision,
                      .status,
                      .requiresAttributes,
                      .compatibilities,
                      .registeredAt,
                      .registeredBy
                    )
                    | .containerDefinitions[0].image =
                      "'$ECR_REPO:$IMAGE_TAG'"
                    ' \
                  > new-task-def.json


                  echo "Registering new task definition..."

                  aws ecs register-task-definition \
                    --cli-input-json file://new-task-def.json \
                    --region $AWS_REGION
                '''
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh '''
                  echo "Deploying to ECS..."

                  aws ecs update-service \
                    --cluster $CLUSTER \
                    --service $SERVICE \
                    --force-new-deployment \
                    --region $AWS_REGION
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployed Successfully to ECS 🚀'
        }

        failure {
            echo '❌ Deployment Failed'
        }
    }
}
