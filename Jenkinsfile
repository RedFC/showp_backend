#!groovy

/*
The MIT License
Copyright (c) 2015-, CloudBees, Inc., and a number of other of contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
pipeline {
    agent any
    stages {
        stage('Deploy') {
                parallel { 
                stage('Cloud Deployment For Production') {
                        when {
                            branch 'main'
                        }
                        steps {
                            script {
                                try {
                                echo 'Deploying Code'
                                withCredentials([
                                        usernamePassword(
                                            credentialsId: 'git-ITSOL',
                                            usernameVariable: 'USER',
                                            passwordVariable: 'PASS'
                                        )]) {
                                            sendChangeLogs()
                                            sshagent (credentials: ['Cloud-Admin']) {
                                                sh 'ssh -o StrictHostKeyChecking=no root@34.72.60.61 "bash master-pull.sh $USER $PASS "'
                                                sh 'ssh -o StrictHostKeyChecking=no root@34.72.60.61 "bash pm2run.sh showp"'
                                            }
                                        }
                                } catch (err) {
                                sh 'Could not connect to HOST'
                                }
                            }
                        }
                }
                }
        }
    }
    post {
       // only triggered when blue or green sign
       success {
           slackSend color: "good", message: '''
           [Showp CI]

           Code deployed and processes restarted 👍

           *Helpful Links*

           1. <http://34.72.60.61:5555|Prisma Dev Studio>
           2. <http://34.72.60.61:5000|Jenkins>
           3. <http://34.72.60.61:5002/|Portainer>
           4. <http://34.72.60.61:5003|PHPMyAdmin>
           5. <http://34.72.60.61:3306|MYSQL>
           6. <http://34.72.60.61:8080|Project URI>
           '''
       }
       // triggered when red sign
       failure {
           slackSend color: "danger", message: "[Showp CI] Opps. Something's wrong with the deployment. 😢"
       }
       // trigger every-works
       always {
           slackSend color: "warning", message: "[Showp CI] All done with my job 💪"
       }
    }
}

@NonCPS
def sendChangeLogs() {
    try {
        def commitMessages = ''
        def changeLogSets = currentBuild.changeSets
        for (int i = 0; i < changeLogSets.size(); i++) {
            def entries = changeLogSets[i].items
            for (int j = 0; j < entries.length; j++) {
                def entry = entries[j]
                commitMessages = commitMessages + "${entry.author} ${entry.commitId}:\n${new Date(entry.timestamp).format('yyyy-MM-dd HH:mm')}: *${entry.msg}*\n"
            }
        }
        slackSend color: 'good', message: "\n[Showp CI]\n\nJob: `${env.JOB_NAME}`\nBuild number: `#${env.BUILD_NUMBER}`\nBuild details: <${env.BUILD_URL}console|See in web console>\n\n*Starting build with changes:*\n${commitMessages}"
    }catch (err) {
        slackSend color: 'danger', message: "[Showp CI]\n\nOpps. Something's wrong with the deployment. 😢\n${err}"
    }
}
