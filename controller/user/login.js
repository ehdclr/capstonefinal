const { User } = require("../../models/User");
const indy = require('../../indy/index.js');
module.exports = {
  post: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });

        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie("x_auth", user.token).status(200).json({
            loginSuccess: true,
            userId: user._id,
            userToken: user.token,
          });
        });
      });
    });
  },

  get: async (req, res) => {
    req.cookie("x_auth")
    await indy.credentials.getCredential();
  }
};
