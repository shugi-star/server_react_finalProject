// src/API/patientsRoutes.js | routes של מטופלים
// services: src/services/patientServices.js
const { verifyToken } = require("../Middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const patientServices = require("../services/patientServices");
const { organizePatients } = require("../services/nurseServices");

//get
//שליפת כל המטופלים כולם כדי ליצור נתונים רנדומליים
//לעשות אבטחה!!!
router.get("/AllPatients", verifyToken, async (req, res) => {
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }
    try {
        patientServices.getAllPatients((err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// הוספת הערה חדשה
router.post("/AddComment", verifyToken, async (req, res) => {
    const { patient_id, comment_text } = req.body;

    if (!patient_id || !comment_text?.trim()) {
        return res.status(400).json({ error: "חסרים נתוני הערה" });
    }

    try {
        await patientServices.addComment(
            Number(patient_id),
            comment_text.trim(),
            req.user.nurseNumber
        );

        res.status(201).json({
            message: "Comment added successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

// עדכון הערה קיימת
router.put("/UpdateComment/:commentId", verifyToken, async (req, res) => {
    const { commentId } = req.params;
    const { comment_text } = req.body;

    if (!comment_text?.trim()) {
        return res.status(400).json({ error: "טקסט ההערה ריק" });
    }

    try {
        await patientServices.updateComment(commentId, comment_text.trim());
        res.json({ message: "Comment updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// שליפת הערות לפי מטופל
router.get("/:id/getComments", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const rows = await patientServices.getComments(id);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// מחיקת מטופל
router.delete("/:patient_id", verifyToken, async (req, res) => {
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }

    try {
        await patientServices.deletePatient(req.params.patient_id);
        res.json({ message: "המטופל נמחק בהצלחה" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get
//שליפת מטופל לפי id
router.get("/:patient_id", verifyToken, async (req, res) => {
    try {
        patientServices.getPatientById(
            req.params.patient_id,
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.json(result);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//פונקציה הוספת מטופל יצירת מטופל חדש + שיוך למיטה
router.post("/new_patient", verifyToken, async (req, res) => {
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }
    const new_patient = req.body;
    try {
        console.log("before adding,new_patient :", new_patient);
        const patientId = await patientServices.addPatient(new_patient);
        console.log("afetr login the new patient:", patientId);

        res.status(201).json({
            message: "patient added successfully",
            patientId,
        });

        await organizePatients();
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
