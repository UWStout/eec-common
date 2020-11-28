module.exports = {
  apps : [{
    name: 'karuna',
    script: './dist/server.js',
    log_file: './logs/output.log',
    time: true
  }, {
    name: 'karuna-dev',
    script: './dist/server.js',
    log_file: './logs/output.log',
    env: {
      DEBUG: 'watch,server:*'
    }
  }]
};
