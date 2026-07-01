// src/Middleware/authMiddleware.js | אימות JWT לפני גישה ל-routes מוגנים

const jwt = require("jsonwebtoken");
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "Avishag&AlumaSecretKey";


// async function verifyToken(req, res, next) {
//     //קבלת הטוקן ועוד כמה דברים
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).json({ message: "No token provided" });
//     }
//     //לקיחת הטוקן עצמו
//     const token = authHeader.split(" ")[1];

//     try {
//         //אימות הטוקן
//         const decoded = jwt.verify(token, SECRET_KEY);
//         req.user = decoded; // שומרים את המשתמש להמשך שימוש
//         next(); // ממשיכים לראוט
//     } catch (err) {
//         console.log("JWT ERROR:", err);
//         return res.status(403).json({ message: "Invalid or expired token" });
//     }
// } 

async function verifyToken(req, res, next) {
    console.log("verifyToken started");

    const authHeader = req.headers.authorization;
    console.log("authHeader =", authHeader);

    if (!authHeader) {
        console.log("No auth header");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token =", token);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded =", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
module.exports = { verifyToken };
