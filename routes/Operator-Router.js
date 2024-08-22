const express = require("express");
const router = express.Router();
const OperatorController = require("../controller/C-Operator");
const authMiddleware = require("../middlerwares/authMiddleware");
const asyncMiddleware = require("../middlerwares/async-middleware");


router.post("/register", asyncMiddleware(OperatorController.Register));
router.post("/login", asyncMiddleware(OperatorController.Login));
router.post(
  "/addAircraftdeatils",
  authMiddleware,
  asyncMiddleware(OperatorController.AddAircrafts)
);
router.get(
  "/getAirCraftOperatorLists",
  authMiddleware,
  asyncMiddleware(OperatorController.getAirCraftOperatorLists)
);
router.get(
  "/getOperatorLists",
  authMiddleware,
  asyncMiddleware(OperatorController.getOperatorsLists)
);
// router.get("/getOperator", authMiddleware, OperatorController.getOperatorlist);
router.put(
  "/editAircraft/:id",
  authMiddleware,
  asyncMiddleware(OperatorController.EditOperator)
);
router.delete(
  "/deleteAircraft/:id",
  authMiddleware,
  asyncMiddleware(OperatorController.DeleteOperator)
);

module.exports = router;
