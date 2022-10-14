const indy = require('../../indy/index.js');

module.exports = {
  post: async (req, res) => {
    try{
      let result = await indy.proofs.verifyProof(req.encryptedMessage);
      if (result) {
        return res.status(200).json({
          success: true
        })
      } else {
        return res.status(400).json({
          success: false,
          result : false
        })
      }
    } catch (err) {
      return res.status(400).json({
        success: false, err
      })
    }
  }
}