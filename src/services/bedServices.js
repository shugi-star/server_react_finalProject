// src/services/bedServices.js | שאילתות ולוגיקה של טבלת beds
// DB callback: src/DB/sqlActions/connectToDB.js
// DB promise:  src/DB/sqlActions/db.js

const db = require("../DB/sqlActions/connectToDB");
const dbPromise = require("../DB/sqlActions/db");

// שליפת מיטה לפי bed_id | הועבר מ-bedsRoutes / servises.js
function getBedById(id, callback) {
    db.query(
        "SELECT * FROM beds WHERE bed_id = ?",
        [id],
        callback
    );
}

// מציאת מיטה פנויה | הועבר מ-nurseRoutes
async function getFreeBed() {
    const [rows] = await dbPromise.query(
        `SELECT * FROM beds WHERE status = 'פנוי' LIMIT 1`
    );
    return rows;
}

//פונקציה לעדכון סטטוס מיטה | הועבר מ-servises.js
async function updateBedStatus(db, bedId, newStatus) {
    // בדיקה שהמיטה קיימת
    const [bed] = await db.query(
        `SELECT * FROM beds WHERE bed_id = ?`,
        [bedId]
    );
    if (bed.length === 0) {
        throw new Error("מיטה לא קיימת");
    }
    // עדכון סטטוס המיטה
    await db.query(
        `UPDATE beds
         SET status = ?
         WHERE bed_id = ?`,
        [newStatus, bedId]
    );
    return { message: "סטטוס עודכן בהצלחה" };
}

async function addBed(nurse_number) {
    const [result] = await dbPromise.query(
        `INSERT INTO beds (status, patient_id, nurse_number)
         VALUES ('פנוי', NULL, ?)`,
        [nurse_number]
    );
    return result.insertId;
}

async function getBedsByNurseNumber(nurse_number) {
    console.log("nurse_number to add", nurse_number)
    const [rows] = await dbPromise.query(
        `SELECT b.bed_id, b.status, b.patient_id, b.nurse_number,
                p.full_name, p.id_number, p.admission_date, p.disease_type
         FROM beds b
         LEFT JOIN patients p ON b.patient_id = p.patient_id
         WHERE b.nurse_number = ?
         ORDER BY b.bed_id`,
        [nurse_number]
    );
    return rows;
}

module.exports = {
    getBedById,
    getFreeBed,
    updateBedStatus,
    addBed,
    getBedsByNurseNumber,
};
