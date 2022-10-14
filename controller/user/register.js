const { User } = require("../../models/User");
const indy = require("../../indy/index");

module.exports = {
  post: async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      let userData = await User.findOne({email: req.body.email});
      await indy.wallet.newRegister(null, userData.email, userData.password);
      return res.status(200).json({
        success: true
      })
    } catch (e) {
      return res.status(400).json({
        success: false, e
      })
    }
  },
};




// module.exports = {
//   post: (req, res) => {
//     const user = new User(req.body);
//     user.save((err, userInfo) => {
//       if (err) {
//         return res.json({ success: false, err });
//       }
//       else {
//         console.log(userInfo)
//         User.findOne({ email: req.body.email }, (err, user) => {
//           if (user) {
//             console.log(user);
//             pw = user.password;
//             console.log(req.body.email, pw);
//             indy.wallet.newRegister(null, req.body.email, pw);
//           } else {
//             console.log(123123)
//             return res.json({success: false, err})
//           }
//         })
//       }
//     });
//   },
// };
