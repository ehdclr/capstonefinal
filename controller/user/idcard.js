const { upload } = require("../../middleware/uploads");
const { User3 } = require("../../models/User2");
const { User } = require("../../models/User");
const indy = require("../../indy/index");
const sdk = require("indy-sdk");

module.exports = {
  post: async (req, res) => {
    try {
      //업로드한 이미지 multer를 통해서 이미지 파일이 여기로 옴
      // aws에 업로드 할 것임
      //이미지가 저장된 aws url 주소를 반환하도록 할 것임
      // let user1;
      let token = req.cookies.x_auth;
      const vcObj = {};
      vcObj["last_name"] = req.body.name.slice(0, 1);
      vcObj["first_name"] = req.body.name.slice(1);
      vcObj["Identification_Number"] = req.body.id;
      vcObj["address"] = req.body.address;
      vcObj["age"] = req.body.age;

      await User.findByToken(token, async (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ message: "토큰이 만료되었습니다." });
        if (user) {
          const user3 = new User3({...req.body, email: user.email,
          }, (err) => {
            if (err) {
              return res.status(400).json({ success: false })
            }
          });
          await user3.save().catch((err) => {
            if (err) {
              return res.status(400).json({ success: false })
            }
          });
          let [proverWallet, userDid, userVerkey, credential, revId, revRegDelta, credId] = await indy.credentials.CreateCredentialProcess(user.email, user.password, vcObj).catch((err) => {
            if (err) {
              return res.status(400).json({ success: false })
            }
          });
          console.log("Create new user account",await sdk.listMyDidsWithMeta(proverWallet));
          console.log("userDid: ",userDid, "userVerkey: ",userVerkey,"credential :",credential,"revId: ",revId,"revRegDelta: ", revRegDelta,"credId: ", credId);

          await sdk.closeWallet(proverWallet);
        }
        return res.status(200).json({ success: true });
      });
    } catch (e) {
      console.log(e);
      return 
       // res.status(401).json({ success: false });
    }
  },

  get: async (req, res) => {
    let curToken = req.cookies.x_auth;
    let userEmail;
    try {
      await User.findByToken(curToken, async(err, user) => {
        if (err) return console.log("gg")
        userEmail = user.email;
        await User3.findOne({ email: userEmail }).then(async (userData) => {
          console.log(userData)
          if (!userData) {
            return res.json({
              success: false, 
              message: "Image not found"
            })
          }
          let data = userData;
          // let proverWallet = await indy.wallet.get(user.email, user.password)
          // let value = await indy.credentials.getCredential(proverWallet)
          return res.status(200).json({
            success: true, data,
          })
        })
      })
    } catch (err) {
      // return res.json({
      //   success: false, err
      // })
    }
  },
};

// User3.findOne({ email: user.email }, (err, images) => {
//   if (err) throw err;
//   if (!images) return res.json({ message: "등록한 이미지가 없습니다!" });
//   res.status(200).json({ message: "get photos", imageUrl: images.image });
// });