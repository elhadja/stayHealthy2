const express = require("express");
const slotController = require("../controllers/slot");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/:patientId/:slotId", auth.patientAuth, slotController.addAppointment);
router.post("/:slotId", auth.patientAuth, slotController.addAppointment);
router.put("/:id" , auth.userAuth, slotController.cancelAppointment);
router.get("/patient/:patientId", auth.patientAuth, slotController.getPatientAppointment);
router.get("/doctor/:idDoctor", auth.doctorAuth, slotController.getDoctorAppointments);
router.get("/patient", auth.patientAuth, slotController.getPatientAppointment);
router.get("/doctor", auth.doctorAuth, slotController.getDoctorAppointments);
router.get("/:id", auth.userAuth, slotController.getAppointmentById);

module.exports = router;
