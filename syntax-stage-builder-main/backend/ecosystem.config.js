module.exports = {
  "apps": [
    {
      "name": "codeacademy-pro",
      "script": "production-ai-server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true
    }
  ]
}