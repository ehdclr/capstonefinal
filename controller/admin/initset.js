const indy = require('../../indy/index');

module.exports = {
  get: async (req, res) => {
    if ((indy.initSet.checkAlreadySet())) {
      await indy.initSet.setup()
      return res.status(200).json({
        success: true,
      })
    } else {
      return res.status(500).json({
        "result": "already set up"
      })
    }
  }
}