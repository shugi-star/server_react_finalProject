// src/API/nurseRoutes.js | routes של אחיות + login
// services: src/services/nurseServices.js, patientServices.js, bedServices.js, passwordServices.js
// middleware: src/Middleware/authMiddleware.js

const dotenv = require("dotenv");
const express = require("express");
const { verifyToken } = require("../Middleware/authMiddleware");
const nurseServices = require("../services/nurseServices");
const passwordServices = require("../services/passwordServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "Avishag&AlumaSecretKey";

// החיבור לדאטה בייס
const db = require("../DB/sqlActions/db");
const route = express.Router();
// GET  שליפת אחות לפי מספר 
route.get("/AllNurses",verifyToken, async (req, res) => {
    console.log("req.user.isHeadNurse", req.user.isHeadNurse)
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }
    try {
        // -> nurseServices.getAllNurses
        const nurses = await nurseServices.getAllNurses();
        res.json(nurses);
    } catch (error) {
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
});

// GET - שליפת שם ומספר האחות 
route.get("/:nurse_and_name_number",verifyToken, async (req, res) => {
    //לבדוק הרשאת גישה
    try {
        // -> nurseServices.getNurseFullNameByNumber
        const nurses = await nurseServices.getNurseFullNameByNumber(req.nurse_number);
        res.json(nurses);
    } catch (error) {
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
});
// console.log(verifyToken)
//יצירת אחות חדשה
//אולי לקבל גם קוד יחד עם הבקשה לפונקציה ואז לעשות הכנסת אחות עם קוד גם
route.post("/new_nurse", verifyToken, async (req, res) => {
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }
    try {
        const new_nurse = { ...req.body };
        new_nurse.id = Number(new_nurse.id);
        new_nurse.head_Nurse = new_nurse.head_Nurse ? 1 : 0;

        if (!new_nurse.fullName || !new_nurse.id || !new_nurse.password) {
            return res.status(400).json({ error: "חובה למלא את כל השדות" });
        }

        const check_nurse = await nurseServices.checkNurseExistsById(new_nurse.id);
        if (check_nurse.length > 0) {
            return res.status(400).json({ error: "הנתונים קיימים כבר במערכת" });
        }

        await nurseServices.insertNurse(new_nurse);

        const passwordHash = await bcrypt.hash(new_nurse.password, 10);
        await passwordServices.insertPassword(new_nurse.id, passwordHash);

        await nurseServices.organizePatients();

        return res.status(201).json({ message: "אחות נוצרה בהצלחה", nurse: new_nurse });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "שגיאת שרת",
        });
    }
});

// POST - login
route.post("/login", async (req, res) => {
    console.log("LOGIN ROUTE HIT");
    try {
        const { nurseId, password } = req.body;
        console.log("nurseId =", nurseId);
        // בדיקת שדות ריקים
        if (!nurseId || !password) {
            return res.status(400).json({ message: "יש למלא שם משתמש וסיסמה" });
        }
        // שליפה מה-DB
        // -> nurseServices.getNurseById
        const nurses = await nurseServices.getNurseById(nurseId);
        console.log("nurses=",nurses)
        // בדיקה אם נמצאה אחות
        if (nurses.length === 0) {
            return res.status(404).json({ message: "אחות לא נמצאה במערכת" });
        }
        const nurse = nurses[0];
        // שליפת סיסמה
        // -> passwordServices.getPasswordByNurseId
        const passwords = await passwordServices.getPasswordByNurseId(nurseId);
      // בדיקה אם קיימת סיסמה
        if (passwords.length === 0) {
            return res.status(404).json({ message: "סיסמה לא נמצאה במערכת" });
        }
        const passwordHash = passwords[0].password;
        // בדיקת סיסמה מול hash מוצפן בלבד (bcrypt)
        const valid = await bcrypt.compare(password, passwordHash);
        if (!valid) {
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        const isHeadNurse = Number(nurse.head_Nurse)==1;

        const token = jwt.sign(
            {
                nurseId: nurse.id,
                nurseNumber: nurse.nurse_number,
                isHeadNurse,
                fullName: nurse.fullName
            },
            SECRET_KEY,
            { expiresIn: "8h" }
        );

        res.json({
            success: true,
            token,
            isHeadNurse,
            fullName: nurse.fullName,
            nurseNumber: nurse.nurse_number,
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאת שרת" });
    }
});

module.exports = route;
