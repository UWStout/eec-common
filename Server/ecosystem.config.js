module.exports = {
  apps: [{
    name: 'karuna',
    script: './src/server.js',
    log_file: './logs/output.log',
    time: true
  }, {
    name: 'karuna-dev',
    script: './src/server.js',
    log_file: './logs/output.log',
    env: {
      DEBUG: 'karuna:*'
    }
  }]
}
