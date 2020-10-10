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
                    }
                    else {
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Deploy') {
            environment {
                REGION = "cn-hongkong"
                OSS_BUCKET = ""
                CDN_PATH = ""
            }
            steps {
                echo '---== Deploy Stage ==---'
                script {
                    if (env.GIT_BRANCH == 'master') {
                        OSS_BUCKET = 's-finance'
                        CDN_PATH = 'https://s.finance/'
                    } else {
                        OSS_BUCKET = 'test-s-finance'
                        CDN_PATH = 'https://test.s.finance/'
                    }
                }
                withCredentials([usernamePassword(credentialsId: 'aliyun-builder', usernameVariable: 'ACCESS_KEY_ID', passwordVariable: 'ACCESS_KEY_SECRET')]){
                    sh "aliyun oss cp --region ${REGION} --access-key-id ${ACCESS_KEY_ID} --access-key-secret ${ACCESS_KEY_SECRET} -f -r oss://${OSS_BUCKET}/ ${LOCAL_BUILD_DIR}"
                    sh "aliyun cdn RefreshObjectCaches --region ${REGION} --access-key-id ${ACCESS_KEY_ID} --access-key-secret ${ACCESS_KEY_SECRET}  --ObjectType Directory --ObjectPath ${CDN_PATH}"
                }
            }
        }
    }
}
