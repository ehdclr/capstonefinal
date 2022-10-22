const indy = require('../../indy/index.js');
const { User3 } = require('../../models/User2');
const { User } = require('../../models/User');

module.exports = {
  post: async (req, res) => {
    try {
      let user = await User.findOne({ token: req.body.qrData })
      let userData = await User3.findOne({email:user.email})
      let proverWallet = await indy.wallet.get(user.email, user.password);
      let result = await indy.proofs.verifyProof(proverWallet, userData.encryptedMessage);

      if (result) {
        await User3.updateOne({token:req.body.token}, {$set: {encryptedMessage: ""}})
        return res.status(200).json({
          success: true
        })
      } else {
        return res.status(400).json({
          success: false,
          result: false,
        })
      }
    } catch (err) {
      return res.status(400).json({
        success: false, 
        err: console.log(err)
      })
    }
  }
}