const indy = require('../../indy/index.js');
const { User3 } = require('../../models/User2');

module.exports = {
  post: async (req, res) => {
    try {
      console.log(req.body)
      let user = await User3.findOne({email:req.body.qrData})
      console.log(user.encryptedMessage)
      let result = await indy.proofs.verifyProof(user.encryptedMessage);
      console.log(12)
      if (result) {
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