pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean') {
    steps {
        bat 'rmdir /s /q node_modules'
        bat 'del package-lock.json'
    }
}

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Setup Appium Driver') {
    steps {
        bat 'appium driver install uiautomator2'
    }
}

        stage('Test Web') {
            steps {
                bat 'npm run android'
            }
        }
    }
}
