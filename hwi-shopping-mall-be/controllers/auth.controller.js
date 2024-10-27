const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("토큰이 유효하지 않습니다.");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("토큰이 유효하지 않습니다");
      }
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    // 1. token값으로 userID를 찾아낸 값을 req.userId로 세팅
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== "admin") {
      throw new Error("admin권한이 없습니다.");
    }
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
