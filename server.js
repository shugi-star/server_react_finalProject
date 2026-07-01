const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(express.json()); // מאפשר לקרוא JSON מהבקשות
// const port = 3001
const port = Number(process.env.PORT) || 3001;
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
// routes: src/API/
app.use("/nurse", require("./src/API/nurseRoutes"));    //אחיות + login
// app.use("/events", require("./src/API/eventsRoutes"));    //אירועים
// app.use("/monitor", require("./src/API/monitorRoutes"));      //מוניטור
// app.use("/passwords", require("./src/API/passwordRoutes"));   //סיסמאות
app.use("/beds", require("./src/API/bedsRoutes"));   //מיטות 
{/* <Route path="/bed/:patientId" element={<Bed />} /> */}
app.use('/patients', require('./src/API/patientsRoutes'));   //מטופלים
// app.use("/shifts", require("./src/API/shiftRoutes"));       //משמרות
app.get("/", (req, res) => {
    res.status(200).json("Final Project Server");
  });
//הגדרת הפורט של הכתובת שבו השרת ירוץ
app.listen(port,() =>{
    console.log(port);
    console.log('Server running on http://localhost:3001');
});
