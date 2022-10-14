const { User } = require("../../models/User");
const { auth } = require("../../middleware/auth");

module.exports = {
  get: (req, res) => {
    console.log(req.user._id);
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    });
  },
};
