pipeline{
    agent any
    tools{
        jdk 'jdk17'
        nodejs 'node22'
    }
    environment {
        SCANNER_HOME=tool 'sonar-scanner'
    }
    stages {
        stage('Clean Workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git branch: 'main', url: 'https://github.com/HajarEB/hospitalApp.git'
            }
        }
        stage('SAST - SonarQube'){
            steps{
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=hospital-app \
                    -Dsonar.projectKey=hospital-app '''
                }
            }
        }
        stage('Semgrep-Scan') {
            steps {
                sh '''
                docker run --rm --network=host -v "$(pwd):/src" --workdir /src semgrep/semgrep \
                semgrep scan --config auto --json --json-output=semgrep.json . '''
            }       
        }
        stage('SCA - Snyk') {
            steps {
                // Use withCredentials to bind a "Secret text" credential as a string.
                withCredentials([string(credentialsId: 'snyk-token-id', variable: 'SNYK_TOKEN')]) {
                    sh "snyk auth ${SNYK_TOKEN}"
                    // Adjust the --org flag value to match your Snyk organization.
                    dir('backend'){
                        sh '''
                            python3 -m venv .venv
                            . .venv/bin/activate
                            pip install -r requirements.txt
                            snyk monitor --org=azurewwww
                        '''
                    }
                    dir('frontend'){
                        sh '''
                            npm install
                            snyk monitor --org=azurewwww
                        '''
                    }
                }
            }
        }
        stage('SBOM file Create') {
            steps {
                dir('frontend'){
                    sh "cyclonedx-npm --output-file sbom.json --output-format JSON"
                }
            }
        }
        stage('File System Scan - Trivy') {
            steps {
                sh "trivy fs . -f json -o trivyfs.json"
            }
        }
        stage("Docker Build & Push"){
            steps{
                script{
                  withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){   
                      sh '''
                        /usr/local/bin/docker-compose build
                        docker tag hospital-app-fastapi-backend thanhpham247/hospital-app-fastapi-backend:latest
                        docker push thanhpham247/hospital-app-fastapi-backend:latest
                        docker tag hospital-app-angular-frontend thanhpham247/hospital-app-angular-frontend:latest
                        docker push thanhpham247/hospital-app-angular-frontend:latest
                      '''
                    }
                }
            }
        }
        stage("Container Scan - Trivy"){
            steps{
                sh '''
                wget https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
                trivy image --format template --template "@./html.tpl" -o Trivy_Backend_Container_Scan.html thanhpham247/hospital-app-fastapi-backend
                trivy image --format template --template "@./html.tpl" -o Trivy_Frontend_Container_Scan.html thanhpham247/hospital-app-angular-frontend
                '''
            }
        }
        stage('Deploy Container'){
            steps{
                sh '/usr/local/bin/docker-compose up -d'
            }
        }
        stage('DAST - OWASP ZAP'){
            steps{
                sh "chmod 777 \$(pwd)"
                sh "docker run --rm -v \$(pwd):/zap/wrk/:rw --name owasp -dt zaproxy/zap-stable /bin/bash"
                // Change the link below to the address of your application
                sh "docker exec owasp zap-baseline.py -t https://192.168.63.133:4200/ -I -j --auto -r DAST_Report.html"
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'semgrep.json, frontend/sbom.json, trivyfs.json, Trivy_Frontend_Container_Scan.html, Trivy_Backend_Container_Scan.html, DAST_Report.html', onlyIfSuccessful: true
        }
    }
}