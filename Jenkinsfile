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
