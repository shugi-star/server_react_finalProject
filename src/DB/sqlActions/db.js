var mysql = require("mysql2")
const pool = mysql.createPool({
    host:"localhost",
    user: "root",
    password: "Ofakim123?",
    database:"AlertifyDB",
    port: process.env.PORT_MYSQL || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  module.exports = pool.promise();