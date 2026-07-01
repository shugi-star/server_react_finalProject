// src/services/shiftServices.js | לוגיקה ושאילתות של טבלת shift
// DB callback: src/DB/sqlActions/connectToDB.js

const db = require("../DB/sqlActions/connectToDB");

//קבלת סוג המשמרת
/** משמרת בוקר 07:00–15:00, ערב 15:00–23:00, לילה 23:00–07:00 */
function getCurrentShiftNumber(date = new Date()) {
    const hour = date.getHours();
    if (hour >= 7 && hour < 15) return 1;
    if (hour >= 15 && hour < 23) return 2;
    return 3;
}

//חישוב סוף המשמרת
function getShiftEndHour(shiftNum, fromDate = new Date()) {
    const end = new Date(fromDate);
    if (shiftNum === 1) {
        end.setHours(15, 0, 0, 0);
    } else if (shiftNum === 2) {
        end.setHours(23, 0, 0, 0);
    } else {
        if (fromDate.getHours() >= 23) {
            end.setDate(end.getDate() + 1);
        }
        end.setHours(7, 0, 0, 0);
    }
    return end;
}

//הוספת המשמרת לטבלת המשמרות
function insertShiftRecord(nurseNumber) {
    const now = new Date();
    const shiftNum = getCurrentShiftNumber(now);
    const endHour = getShiftEndHour(shiftNum, now);

    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO shift (shiftNum, startHour, endHour, nurse_number)
             VALUES (?, NOW(), ?, ?)`,
            [shiftNum, endHour, nurseNumber],
            (err, result) => {
                if (err) reject(err);
                else resolve({ shiftNum, startHour: now, endHour, insertId: result.insertId });
            }
        );
    });
}

module.exports = {
    getCurrentShiftNumber,
    getShiftEndHour,
    insertShiftRecord,
};
