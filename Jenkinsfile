#!/usr/bin/groovy

def MAIN_BRANCH = 'master'
def imgNode = docker.image('registry.santechdev.fr/docker-node-builder');

def notify(status) {
  // TODO
}

def runParallel(folders, command) {
  tasks = [:]
  for (int i = 0; i < folders.size(); i++) {
    def folder = folders[i]
    tasks[folder] = {
      ansiColor('xterm') {
        sh "cd @santech/${folder} && ${command}"
      }
    }
  }
  tasks.failFast = true
  parallel tasks
}

pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr : '5'))
  }

  environment {
    NPM_CONFIG_LOGLEVEL='warn'
  }

  stages {
    stage('pull build image') {
      steps {
        script {
          notify('INPROGRESS')
          imgNode.pull()
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('build in docker') {
      steps {
        script {
          def deps = [
            "core",
            "common",
            "websocket",
            "angular-analytics",
            "angular-platform",
            "angular-common",
            "angular-websocket",
            "angular-i18n",
            "analytics-core",
            "analytics-integration"]

          imgNode.inside("--privileged --cpus=3") {
            withCredentials([[
              $class: 'StringBinding',
              credentialsId: 'npm-santechdev',
              variable: 'NPM_TOKEN'
            ]]) {

              stage('prepare npm') {
                configFileProvider([configFile(fileId: 'npmrc', variable: 'NPMRC')]) {
                  sh 'cp $NPMRC ~/.npmrc'
                }
              }

              stage('install') {
                ansiColor('xterm') {
                  sh "yarn"
                }
              }

              stage('lint') {
                ansiColor('xterm') {
                  sh "yarn run lint"
                }
                if('UNSTABLE' == currentBuild?.result) {
                  notify('FAILED')
                }
              }

              stage('build') {
                ansiColor('xterm') {
                  sh "yarn run build"
                }
                if('UNSTABLE' == currentBuild?.result) {
                  notify('FAILED')
                }
              }

              stage('test') {
                ansiColor('xterm') {
                  sh "yarn run test"
                }
                if('UNSTABLE' == currentBuild?.result) {
                  notify('FAILED')
                }
              }

              stage('publish') {
                if (env.BRANCH_NAME == 'master') {
                  runParallel(deps, '../../scripts/publish.sh')
                } else {
                  echo 'skipping publish as not on master'
                }
              }
            }
          }
        }
      }
    }
  }

  post {
    always {
      deleteDir()
    }
  }
}
