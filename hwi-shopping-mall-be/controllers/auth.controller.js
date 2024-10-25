const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

// login은 auth에 가까워서 authController에 더 적합.. 다시 작성
authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. user DB에서 요청한 email 기반 탐색
    let user = await User.findOne({ email: email });
    if (user) {
      // 2. 탐색 결과 user가 있다면 암호화한 비밀번호와 대조
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        // 3. 1,2결과 만족시 user 모델 기반 메서드로 token 생성
        const token = await user.generateToken();
        return res.status(200).json({ status: "ok", user, token });
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
