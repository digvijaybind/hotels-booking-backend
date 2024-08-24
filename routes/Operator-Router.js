const express = require("express");
const router = express.Router();
const OperatorController = require("../controller/C-Operator");
const { OperatorAuthMiddleware } = require("../middlerwares/authMiddleware");




router.post("/register", OperatorController.Register);
router.post("/login", OperatorController.Login);
router.post("/addHotel", OperatorAuthMiddleware, OperatorController.AircraftOPeratorHotel)
router.get("/allMyHotel", OperatorAuthMiddleware, OperatorController.GetAllMyAircraftOperatorHotel)
router.put("/updateHotel", OperatorAuthMiddleware, OperatorController.EditAircraftOPeratorHotel)
router.delete("/deleteHotel", OperatorAuthMiddleware, OperatorController.DeleteAircraftOperatorHotel)


module.exports = router;
