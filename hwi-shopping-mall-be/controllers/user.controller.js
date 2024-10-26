const userController = {};
const User = require("../models/User");
const bcrypt = require("bcryptjs");

userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level } = req.body; // password 재할당 위해 let사용
    // 1. 중복 메일 확인
    const user = await User.findOne({ email: email });
    if (user) {
      throw new Error("가입한 이메일이 이미 존재합니다.");
    }
    // 2. password 암호화
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);
    // 3. User모델로 newUser 생성 및 데이터베이스 저장
    const newUser = new User({
      email,
      password,
      name,
      level: level ? level : "customer",
    });
    await newUser.save();
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// validation한 token으로 유저 return
userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ status: "ok", user });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
