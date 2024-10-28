const userController = {};
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// req => DB => res 비동기 함수.
userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level } = req.body;
    // 1. 중복메일 확인
    const user = await User.findOne({ email: email });
    if (user) {
      throw new Error("가입한 이메일이 이미 존재합니다.");
    }

    // 2. 패스워드 암호화
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);

    // 3. 새롭게 생성한 패스워드로 newUser생성 및 DB저장
    const newUser = await new User({
      email,
      password: password,
      name: name,
      level: level ? level : "customer",
    });
    await newUser.save();
    // 4. 새 유저 결과값 res
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
