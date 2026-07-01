// src/services/patientServices.js | שאילתות ולוגיקה של טבלת patients
// DB callback: src/DB/sqlActions/connectToDB.js
// DB promise:  src/DB/sqlActions/db.js

const db = require("../DB/sqlActions/connectToDB");
const dbPromise = require("../DB/sqlActions/db");

// שליפת כל המטופלים | הועבר מ-bedsRoutes / patientsRoutes
function getAllPatients(callback) {
    db.query(
        "SELECT * FROM patients",
        callback
    );
}

// שליפת מטופלים לפי מספר אחות | הועבר מ-bedsRoutes / patientsRoutes
async function getPatientsByNurseNumber(id_number) {
    console.log("in regular nurse-fech her patients:)")
    const [rows] = await dbPromise.query(
        `SELECT * FROM patients WHERE nurse_number = ?`,
        [id_number]
    );
    console.log("rows", rows)
    return rows;
}

// שליפת מטופל לפי patient_id | הועבר מ-patientsRoutes
function getPatientById(patient_id, callback) {
    db.query(
        "SELECT * FROM patients WHERE patient_id = ?",
        [patient_id],
        callback
    );
}

// בדיקה אם מטופל קיים לפי ת.ז. | הועבר מ-nurseRoutes
async function getPatientByIdNumber(id_number) {
    const [rows] = await dbPromise.query(
        `SELECT * FROM patients WHERE id_number = ?`,
        [id_number]
    );
    return rows;
}

// הכנסת מטופל חדש | הועבר מ-nurseRoutes
async function insertPatient(full_name, id_number, disease_type, comments) {
    const [result] = await dbPromise.query(
        `INSERT INTO patients (full_name, id_number, disease_type, comments)
             VALUES (?, ?, ?, ?)`,
        [full_name, id_number, disease_type, comments]
    );
    return result;
}

async function ensureCommentsTable() {
    const [[{ dbName }]] = await dbPromise.query("SELECT DATABASE() AS dbName");
    const [legacyTables] = await dbPromise.query(
        `SELECT TABLE_NAME
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Comments'`,
        [dbName]
    );
    const [currentTables] = await dbPromise.query(
        `SELECT TABLE_NAME
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'comments'`,
        [dbName]
    );

    if (legacyTables.length && !currentTables.length) {
        await dbPromise.query("RENAME TABLE Comments TO comments");
    }

    await dbPromise.query(`
        CREATE TABLE IF NOT EXISTS comments (
            comment_id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            nurse_number INT NULL,
            comment_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    let [columns] = await dbPromise.query("SHOW COLUMNS FROM comments");
    let columnNames = columns.map((column) => column.Field);

    if (!columnNames.includes("comment_id") && columnNames.includes("id")) {
        await dbPromise.query(
            "ALTER TABLE comments CHANGE id comment_id INT AUTO_INCREMENT"
        );
        [columns] = await dbPromise.query("SHOW COLUMNS FROM comments");
        columnNames = columns.map((column) => column.Field);
    }

    if (!columnNames.includes("comment_text") && columnNames.includes("body")) {
        await dbPromise.query(
            "ALTER TABLE comments CHANGE body comment_text TEXT NOT NULL"
        );
        [columns] = await dbPromise.query("SHOW COLUMNS FROM comments");
        columnNames = columns.map((column) => column.Field);
    }

    if (!columnNames.includes("patient_id")) {
        await dbPromise.query(
            "ALTER TABLE comments ADD COLUMN patient_id INT NOT NULL"
        );
    }

    if (!columnNames.includes("nurse_number")) {
        await dbPromise.query(
            "ALTER TABLE comments ADD COLUMN nurse_number INT NULL"
        );
    }
}

// שליפת כל ההערות של מטופל
async function getComments(patient_id) {
    await ensureCommentsTable();

    const [rows] = await dbPromise.query(
        `SELECT
            c.comment_id,
            c.patient_id,
            c.comment_text,
            c.created_at,
            c.updated_at,
            n.fullName AS nurse_name
         FROM comments c
         LEFT JOIN nurse n ON c.nurse_number = n.nurse_number
         WHERE c.patient_id = ?
         ORDER BY c.created_at DESC`,
        [patient_id]
    );

    return rows;
}

// עדכון הערה בודדת
async function updateComment(comment_id, comment_text) {
    await ensureCommentsTable();

    const [result] = await dbPromise.query(
        `UPDATE comments SET comment_text = ? WHERE comment_id = ?`,
        [comment_text, comment_id]
    );

    if (result.affectedRows === 0) {
        throw new Error("הערה לא נמצאה");
    }
}

async function addComment(patient_id, comment_text, nurse_number) {
    await ensureCommentsTable();

    const [result] = await dbPromise.query(
        `INSERT INTO comments (patient_id, nurse_number, comment_text)
         VALUES (?, ?, ?)`,
        [patient_id, nurse_number, comment_text]
    );

    return result.insertId;
}

async function addPatient(new_patient) {
    console.log("new_patient", new_patient);

    const exists = await isPatientExists(new_patient.id_number);
    if (exists) {
        throw new Error("מטופל עם תעודת זהות זו כבר קיים");
    }

    const bed = await getFreeBed();
    const current_bed = bed;

    if (!bed_id) throw new Error("אין מיטות פנויות");

    console.log("bed_id:", bed_id);
    let result;
    try {
        [result] = await dbPromise.query(
            `INSERT INTO patients 
            (full_name, id_number, admission_date, disease_type, nurse_number, bed_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                new_patient.full_name,
                new_patient.id_number,
                new_patient.admission_date,
                new_patient.disease_type,
                current_bed.nurse_number,
                current_bed.bed_id
            ]
        );

        console.log("SQL RESULT:", result);

    } catch (err) {
        console.error("MYSQL ERROR:", err);
        throw err;
    }

    const patientId = result.insertId;

    await occupyBed(bed_id, patientId);

    return patientId;
}
async function isPatientExists(id_number) {
    const [rows] = await dbPromise.query(
        "SELECT patient_id FROM patients WHERE id_number = ?",
        [id_number]
    );

    return rows.length > 0;
}
async function occupyBed(bed_id, patient_id) {
    await dbPromise.query(
        "UPDATE beds SET status = 'תפוס', patient_id = ? WHERE bed_id = ?",
        [patient_id, bed_id]
    );
}
async function deletePatient(patient_id) {
    const [patients] = await dbPromise.query(
        "SELECT patient_id FROM patients WHERE patient_id = ?",
        [patient_id]
    );

    if (!patients.length) {
        throw new Error("מטופל לא נמצא");
    }

    await dbPromise.query(
        "UPDATE beds SET status = 'פנוי', patient_id = NULL WHERE patient_id = ?",
        [patient_id]
    );

    const [result] = await dbPromise.query(
        "DELETE FROM patients WHERE patient_id = ?",
        [patient_id]
    );

    if (result.affectedRows === 0) {
        throw new Error("מטופל לא נמצא");
    }
}

async function getFreeBed() {
    console.log("bbb")

    const [rows] = await dbPromise.query(
        "SELECT * FROM beds WHERE status = 'פנוי' LIMIT 1"
    );

    return rows.length ? rows[0] : null;
}
module.exports = {
    getAllPatients,
    getPatientsByNurseNumber,
    getPatientById,
    getPatientByIdNumber,
    insertPatient,
    getComments,
    updateComment,
    addComment,
    addPatient,
    deletePatient,
    getFreeBed,
    occupyBed,
    isPatientExists
};
