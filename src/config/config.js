const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "debatalk-back-local",
    "host": "127.0.0.1",
    "port": "3307",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "debatalk-back",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "debatalk-back",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
