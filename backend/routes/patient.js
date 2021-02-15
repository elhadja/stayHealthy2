const express = require("express");
const usersControllers = require("../controllers/patient");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", usersControllers.addNewUser);
router.post("/login", usersControllers.logsUser); 
router.delete("/:id", auth.patientAuth, usersControllers.deleteUser);
router.get("/:id", auth.userAuth, usersControllers.getPatientById);
router.put("/:id", auth.patientAuth, usersControllers.updatePatient);

module.exports = router;
