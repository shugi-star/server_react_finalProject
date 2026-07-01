var mysql = require("mysql2")
function createDB(){
    //חיבור לmysql
    var connection = mysql.createConnection({
        host:"localhost",
        user: "root",
        password: "Ofakim123?"
      });

      connection.query(`CREATE DATABASE AlertifyDB`, function (err, result) {
        if (err) throw err;
        console.log(`${process.env.DB_NAME} created`);
      });
}
createDB();
module.exports = createDB;