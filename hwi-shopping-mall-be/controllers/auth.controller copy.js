const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

// 요청목적: 백엔드주소/auth/login => 로그인하면 토큰 생성
// 요청방법:
authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. user DB에서 요청한 email 기반 탐색
    const user = await User.findOne({ email: email });
    // 2. 탐색 결과 user가 있다면 암호화한 비밀번호와 대조
    // 3. 1,2결과 만족시 user 모델 기반 메서드로 token 생성
  } catch (error) {}
};

// user 권한 유무 판단 (DB회원정보저장)
authController.authenticate = async (req, res, next) => {
  try {
    // 1. 요청한 header의 header token값 save
    // 2. token값 가공("Bearer "삭제) 및 verify
    // 3. req의 userId에 결과 id값 첨부
    // 요청에 userId값 하나 더 얹어서 toss
  } catch (error) {}
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
