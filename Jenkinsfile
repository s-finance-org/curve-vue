import java.text.SimpleDateFormat

pipeline {
    agent {
        docker {
            label 'web'
            image "backend/build:nodejs"
        }
    }
    options {
        disableConcurrentBuilds()
    }
    environment {
        BUILD_VERSION = ''
        LOCAL_BUILD_DIR = 'dist'
    }
    stages {
        stage('Init') {
            steps {
                echo '---== Init Environment Variable ==---'
                echo "Git Branch: ${env.GIT_BRANCH} Commit: ${env.GIT_COMMIT}"
                script {
                    def dateFormat = new SimpleDateFormat("yyyyMMddHHmm").format(new Date())
                    BUILD_VERSION = "${dateFormat}.${env.BUILD_NUMBER}.${env.GIT_COMMIT.take(7)}"
                }
                echo "Build Version: ${BUILD_VERSION}"
                // Clean Previous Build
                sh "rm -rf ${LOCAL_BUILD_DIR}"
                // Package Artifact
                sh "rm -f *.tar.gz"
            }
        }
        stage('Build') {
            steps {
                echo '---== Build Stage ==---'
                // Prepare Build Environment
                sh 'npm install'
                // Build
                sh "npm config set s-finance-web:build_version ${BUILD_VERSION}"
                script {
                    if (env.GIT_BRANCH == 'master') {
                        sh 'npm run prod'
                    } else {
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Deploy') {
            environment {
                CLOUD_FRONT_DIST_ID = ''
                S3_BASE_URL = ''
                S3_REGION = 'ap-northeast-1'
            }
            steps {
                echo '---== Deploy Stage ==---'
                script {
                    if (env.GIT_BRANCH == 'master') {
                        CLOUD_FRONT_DIST_ID = 'E1D5X5GWQ7S1VZ'
                        S3_BASE_URL = 's3://s.finance/prod'
                    } else {
                        CLOUD_FRONT_DIST_ID = 'E274MPTHP4VXQ'
                        S3_BASE_URL = 's3://s.finance/test'
                    }
                }
                withCredentials([usernamePassword(credentialsId: 'aws-deployer', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]){
                    // Upload Build Files
                    sh "aws s3 sync ${LOCAL_BUILD_DIR} ${S3_BASE_URL} --acl public-read --delete"
                    sh "aws cloudfront create-invalidation --distribution-id ${CLOUD_FRONT_DIST_ID} --paths '/*'"
                }
            }
        }
    }
}
