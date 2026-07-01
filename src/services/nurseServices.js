// src/services/nurseServices.js | שאילתות ולוגיקה של טבלת nurse
// DB callback: src/DB/sqlActions/connectToDB.js
// DB promise:  src/DB/sqlActions/db.js

const db = require("../DB/sqlActions/connectToDB");
const dbPromise = require("../DB/sqlActions/db");

//בדיקה אם זו אחות ראשית או לא
function ifHeaderNurse(nurse_number, callback) {

    const sql = `SELECT head_Nurse FROM nurse WHERE nurse_number = ?`;

    db.query(sql, [nurse_number], (err, result) => {

        if (err) {
            return callback(err, null);
        }
        // אם לא נמצאה אחות
        if (result.length === 0) {
            return callback(null, false);
        }
        // מחזיר true/false
        callback(null, result[0].head_Nurse === 1);
    });
}
//פונקציה לעדכון מספר האחות לכל מטופל
async function organizePatients(dbConn = dbPromise) {

    // שליפת כל האחיות מהמסד
    const [nurses] = await dbConn.query(`SELECT nurse_number FROM nurse`);

    // שליפת כל המטופלים מהמסד
    const [patients] = await dbConn.query(`SELECT patient_id FROM patients`);

    // אם אין אחיות במערכת - אין למי לחלק מטופלים
    if (nurses.length === 0) return;

    // חישוב כמה מטופלים כל אחות צריכה לקבל (חלוקה שווה)
    const patientsPerNurse = Math.ceil(patients.length / nurses.length);

    // אינדקס שמצביע על המטופל הנוכחי ברשימה
    let patientIndex = 0;

    // מעבר על כל האחיות
    for (let i = 0; i < nurses.length; i++) {

        // לכל אחות נותנים מספר מטופלים לפי החישוב
        for (let j = 0; j < patientsPerNurse; j++) {

            // אם נגמרו המטופלים - מפסיקים את הלולאה
            if (patientIndex >= patients.length) break;

            // עדכון במסד: קישור המטופל לאחות הנוכחית
            await dbConn.query(
                `UPDATE patients
                 SET nurse_number = ?
                 WHERE patient_id = ?`,
                [nurses[i].nurse_number, patients[patientIndex].patient_id]
            );

            // מעבר למטופל הבא
            patientIndex++;
        }
    }
}

async function getAllNurses() {
    const [rows] = await dbPromise.query(
        `SELECT nurse_number, fullName FROM nurse;`
    );
    return rows;
}

// שליפת שם אחות לפי מספר | הועבר מ-nurseRoutes
async function getNurseFullNameByNumber(nurse_number) {
    const [rows] = await dbPromise.query(
        `SELECT fullName FROM nurse WHERE nurse_number = ${nurse_number}   `
    );
    return rows;
}

// בדיקה אם אחות קיימת | הועבר מ-nurseRoutes
async function checkNurseExistsById(id) {
    const [rows] = await dbPromise.query(
        `SELECT * FROM nurse WHERE id = ? ORDER BY nurse_number`,
        [id]
    );
    return rows;
}

// הוספת אחות חדשה | הועבר מ-nurseRoutes
async function insertNurse(new_nurse) {
    const insertQuery = `
        INSERT INTO nurse (fullName, id, head_Nurse)
        VALUES (?, ?, ?)
      `;
    const [result] = await dbPromise.query(insertQuery, [
        new_nurse.fullName,
        new_nurse.id,
        new_nurse.head_Nurse
    ]);
    return result;
}

// שליפת אחות לפי id (login) | הועבר מ-nurseRoutes
async function getNurseById(nurseId) {
    const [nurses] = await dbPromise.execute(
        "SELECT * FROM nurse WHERE id = ?",
        [nurseId]
    );
    return nurses;
}

module.exports = {
    ifHeaderNurse,
    organizePatients,
    getNurseFullNameByNumber,
    checkNurseExistsById,
    insertNurse,
    getNurseById,
    getAllNurses
};
