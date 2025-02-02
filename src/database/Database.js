require("dotenv").config();
const { Pool } = require("pg");

class Database {
  constructor() {
    this.database = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    });
  }
}

module.exports = Database;
