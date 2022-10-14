const express = require("express");

const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminController } = require("../controller");

router.get("/api/admins/initset", adminController.initset.get);
// router.get("api/admins/removeset", auth, adminController.removeset.get);//

// router.post("api/admins/qrscan", auth, adminController.qrscan.post);

module.exports = router;

