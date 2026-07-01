// src/API/shiftRoutes.js | routes של משמרות
// services: src/services/shiftServices.js

const express = require("express")
const router =express.Router();
const shiftServices = require("../services/shiftServices");

module.exports = router;
module.exports.getCurrentShiftNumber = shiftServices.getCurrentShiftNumber;
module.exports.getShiftEndHour = shiftServices.getShiftEndHour;
module.exports.insertShiftRecord = shiftServices.insertShiftRecord;
