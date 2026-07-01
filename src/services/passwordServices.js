// src/services/passwordServices.js | שאילתות של טבלת passwords
// DB promise: src/DB/sqlActions/db.js

const db = require("../DB/sqlActions/db");

// שליפת סיסמה לפי id אחות (login) | הועבר מ-nurseRoutes
async function getPasswordByNurseId(nurseId) {
    const [passwords] = await db.execute(
        "SELECT password FROM passwords WHERE id = ?",
        [nurseId]
    );
    return passwords;
}

// שמירת סיסמה מוצפנת לאחות חדשה | נקרא מ-nurseRoutes
async function insertPassword(nurseId, passwordHash) {
    await db.execute(
        "INSERT INTO passwords (id, password) VALUES (?, ?)",
        [nurseId, passwordHash]
    );
}

module.exports = {
    getPasswordByNurseId,
    insertPassword,
};
