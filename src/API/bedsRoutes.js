const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");

const patientServices = require("../services/patientServices");
const bedServices = require("../services/bedServices");

function getAllPatientsAsync() {
    return new Promise((resolve, reject) => {
        patientServices.getAllPatients((err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

router.get("/GetPaientsToNurse", verifyToken, async (req, res) => {
    try {
        const nurse_number = req.user.nurseNumber;

        if (req.user.isHeadNurse) {
            //אחות ראשית
            const patients = await getAllPatientsAsync();
            return res.json(patients);
        }
        //אחות רגילה
        const beds = await bedServices.getBedsByNurseNumber(nurse_number);
        res.json(beds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            bedServices.getBedById(req.params.id, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/addBed", verifyToken, async (req, res) => {
    if (!req.user?.isHeadNurse) {
        return res.status(403).json({ error: "אין הרשאת גישה" });
    }

    try {
        const { nurse_number } = req.body;
        const bedId = await bedServices.addBed(nurse_number);

        res.status(201).json({
            message: "bed added",
            bedId,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
