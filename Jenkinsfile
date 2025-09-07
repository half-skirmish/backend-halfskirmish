pipeline {
    agent any

    environment {
        IMAGE_NAME      = "halfskirmish_admin"
        TAG             = "latest"
        REGISTRY        = "10.243.4.236:5000"
        DEPLOYMENT_NAME = "halfskirmish-admin"
        DOCKER_HOST     = "tcp://10.243.52.185:2375"
        APP_NETWORK     = "app"

        // Pull from Jenkins credentials
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = credentials('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
        CLERK_SECRET_KEY                  = credentials('CLERK_SECRET_KEY')
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh """
                        docker build \
                          --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} \
                          -t ${IMAGE_NAME}:${TAG} .
                    """
                }
            }
        }

        stage('Tag Image for Registry') {
            steps {
                script {
                    echo 'Tagging image for remote registry...'
                    sh "docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Push Image to Registry') {
            steps {
                script {
                    echo 'Pushing Docker Image to Registry...'
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Deploy to Remote Docker') {
            steps {
                script {
                    echo "Deploying ${DEPLOYMENT_NAME} on remote Docker host..."

                    // Ensure network exists
                    sh """
                        docker -H ${DOCKER_HOST} network inspect ${APP_NETWORK} >/dev/null 2>&1 || \
                        docker -H ${DOCKER_HOST} network create ${APP_NETWORK}
                    """

                    // Stop/remove old container
                    sh """
                        docker -H ${DOCKER_HOST} ps -q --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                        docker -H ${DOCKER_HOST} stop ${DEPLOYMENT_NAME} || true
                    """
                    sh """
                        docker -H ${DOCKER_HOST} ps -aq --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                        docker -H ${DOCKER_HOST} rm ${DEPLOYMENT_NAME} || true
                    """

                    // Run new container with env vars
                    sh """
                        docker -H ${DOCKER_HOST} run -d --name ${DEPLOYMENT_NAME} \\
                        --network ${APP_NETWORK} \\
                        -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} \\
                        -e CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \\
                        ${REGISTRY}/${IMAGE_NAME}:${TAG}
                    """
                }
            }
        }

        stage('Cleanup Local') {
            steps {
                script {
                    echo 'Cleaning up unused local Docker resources...'
                    sh "docker image prune -f"
                    sh "docker container prune -f"
                }
            }
        }
    }
}
