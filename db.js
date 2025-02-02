const mysql = require("mysql2");

// Create the connection pool.
const conn = mysql.createConnection({
  host: "localhost",
  user: "W1_87135_Sanjivani",
  password: "manager",
  database: "projectdb",
});

module.exports = conn;