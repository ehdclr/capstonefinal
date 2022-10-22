const { User3 } = require("../../models/User2");
const { User } = require("../../models/User");
const indy = require("../../indy/index");

module.exports = {
  //postman test용, 원래는 get요청
  post: async (req, res) => {
    try {
      let token = req.cookies.x_auth;
      let user = await User.findOne({ token: token })
      let encryptedMessageRequest = await User3.findOne({ email: user.email })
      
      if (!encryptedMessageRequest.encryptedMessage) {
        console.log(123)
        let proverWallet = await indy.wallet.get(user.email, user.password);
        let encryptedMessage = await indy.proofs.ProverSubmitPresentation(proverWallet);
        await User3.updateOne({ token: token }, { encryptedMessage: encryptedMessage })
        if (encryptedMessage) {
          return res.status(200).json({
            success: true,
            token: token
          })
        }
      } else {
        console.log(456)
        return res.status(200).json({
          success: true,
          token: token
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  get: async (req, res) => {
    try {
      let currentUser;
      let token = req.cookies.x_auth;
      User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ message: "토큰이 만료되었습니다." });
        if (user) {
          currentUser = user;
        }
      })
      let proverWallet = await indy.wallet.get(currentUser.email, currentUser.password)
      let proofMessage = await indy.proofs.acceptProofReq(proverWallet)
      console.log("qr에 들어갈 증명내용 :", proofMessage)
    } catch (err) {
      console.log(err)
    }
  }
}




// post: async (req, res) => {
//   try {
//     let token = req.cookies.x_auth;
//     let IndyRequest = req.body.IndyRequest;
//     //false면 처음 인디 요청 하는 사람 
//     let user = await User.findOne({ token: token })
//     let encryptedMessageRequest = await User3.findOne({email:user.email})
//     if (!IndyRequest && encryptedMessageRequest.encryptedMessage ===undefined) {
//       //TODO() : 
//       //1.페이지 리로드 했을 때 해결 방법 DB에 encryptedMessage가 이미 있는 상태면, 인디요청 안하고 불러오기
//       //2.encryptedMessage가 없는 상태면 indy요청해서 update하기  
//       console.log("처음 요청한 사람입니다.");

//       let proverWallet = await indy.wallet.get(user.email, user.password);
//       let encryptedMessage = await indy.proofs.ProverSubmitPresentation(proverWallet);

//       await User3.updateOne({ token: token }, { encryptedMessage: encryptedMessage })
//       if (encryptedMessage) {
//           return res.status(200).json({
//           success: true,
//           token: token
//         })
//       } else {
//           return res.status(400).json({
//           result: "Fail to generate QRcode"
//           })
//       }
//     }
//     else {
//       //이미 인디 요청을 했던 사람 ! 
//       console.log("이미 요청했던 사용자입니다!")
//       let userInfo = await User3.findOne({ email: user.email });
//       if (userInfo.encryptedMessage) {
//         return res.status(200).json({
//           success: true,
//           email: user.email,
//           encryptedMessage: userInfo.encryptedMessage
//          })
//       } else {
//         return res.json({
//           success:false
//         })
//       }
//      }
//   } catch (err) {
//     console.log(err)
//   }
// },