module.exports = {
  apps: [{
    name: 'ethioservice-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    max_memory_restart: '500M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 5000
  }]
};
