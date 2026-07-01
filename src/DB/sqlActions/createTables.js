const conDB = require("./connectToDB");
const path = require("path");
const fs = require("fs");

//פונקציה ליצירת טבלה אחת
function createTable(query, tableName) {
    return new Promise((resolve, reject) => {
      conDB.query(query, (err, result) => {
        if (err) return reject(err);
        console.log(`✅ ${tableName} table created`);
        resolve(result);
      });
    });
  }
  async function createTables(){
      try{
        const tableFiles = [
           //"../sqlTables/nurse.sql",
           // "../sqlTables/shift.sql",
           // "../sqlTables/patients.sql",
            //"../sqlTables/events.sql",
            "../sqlTables/passwords.sql",
            "../sqlTables/monitor.sql",
            "../sqlTables/beds.sql"
        ];
      for (const file of tableFiles) {
           // קריאת קובץ ה-SQL
           const query = fs.readFileSync(file, "utf8");
              // חילוץ שם הטבלה מהקובץ
         const tableName = file.split("/").pop().replace(".sql", "");
           // יצירת טבלה
         await createTable(query, tableName);
         console.log("All tables created successfully!");
       }    
  }catch(err){
    console.error("❌ Error creating tables:", err);
       }

    }
    function update(){
     // conDB.query("ALTER TABLE patients ADD bed_id INT");
    // conDB.query("ALTER TABLE patients ADD comments TEXT");
    conDB.query("ALTER TABLE beds ADD nurse_number INT NOT NULL");
    }
    update();
   // createTables();
module.exports = createTables;
