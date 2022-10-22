const { User } = require("../../models/User");

module.exports = {
  post: (req, res) => {
    let token = req.cookies.x_auth;

    User.findByToken(token, (err, user) => {
      if (err) throw err;
      if (!user) return res.json({ isAuth: false, error: true });
      if (user) {
        user.compareSecondPassword(req.body.secondpassword, (err, isMatch) => {
          if (!isMatch) {
            return res.json({
              secPasswordSuccess: false,
              message: "2차 비밀번호가 틀렸습니다",
            });
          }
          res
            .status(200)
            .json({ secPasswordsuccess: true, message: "2차 비밀번호 통과" });
        });
      }
    });
  },
};
