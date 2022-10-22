const express = require("express");
const indy = require("../indy/index");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/uploads");
const { userController } = require("../controller");

router.post("/api/users/login", userController.login.post);
router.post("/api/users/register", userController.register.post);
router.post("/api/users/secPw", userController.secPw.post);
router.post("/api/users/image", auth, upload.single("file"), userController.image.post);
router.post("/api/users/idcard", auth, userController.idcard.post);
router.post("/api/users/qrgen", userController.qrgen.post);


router.get("/api/users/idcard", auth, userController.idcard.get);
router.get("/api/users/logout", auth, userController.logout.get);
router.get("/api/users/auth", auth, userController.auth.get);
router.get("/api/users/test", auth, async (req, res) => {
  try {
    let proverWallet = await indy.wallet.get("zzz@gmail.com", "$2b$10$KwIYaC2iL6UyLSPMgZAA0.OiUfeBn2tLSfbKtR4YPLSjbFW4RbOM.")
    await indy.did.createDid("00000000000000000000123456789012", proverWallet)
    // console.log(test);
    return 
  } catch (err) {
    throw err;
  }
})
module.exports = router;
