let mysql = require('mysql2')

let con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Ofakim123?",
    database: "AlertifyDB"
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connected to mysql!");
});
module.exports = con;
