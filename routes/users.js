const express = require("express");

const router = express.Router();
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/uploads");
const { userController } = require("../controller");

router.post("/api/users/login", userController.login.post);
router.post("/api/users/register", userController.register.post);
router.post("/api/users/secPw", userController.secPw.post);
router.post(
  "/api/users/idcard",
  upload.single("image"),
  userController.idcard.post
);
router.post("/api/users/qrgen", userController.qrgen.post);
router.get("/api/users/idcard", auth, userController.idcard.get);

router.get("/api/users/logout", auth, userController.logout.get);
router.get("/api/users/auth", auth, userController.auth.get);

module.exports = router;
