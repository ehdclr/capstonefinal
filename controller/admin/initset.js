const indy = require('../../indy/index');
const { User } = require('../../models/User');

module.exports = {
  get: async (req, res) => {
    let token = req.cookies.x_auth;
    let user = await User.findOne({ token: token });

    if (user.role === 1) {
      if (indy.initSet.checkAlreadySet()) {
        await indy.initSet.setup()
        return res.status(200).json({
          success: true,
        })
      } else {
        return res.status(500).json({
          "result": "already set up"
        })
      }
    } else {
      return res.status(501).json({
        success:false,
        message: "관리자 계정이 아닙니다."
      })
    }
    
    
  }
}