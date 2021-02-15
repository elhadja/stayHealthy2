const express = require("express");
const slotController = require("../controllers/slot");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/:id", auth.userAuth, slotController.getSlotsBy);

module.exports = router;
