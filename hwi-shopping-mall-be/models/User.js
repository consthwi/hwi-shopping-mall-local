const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // 중복체크
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // 오타 수정
    },
    level: {
      type: String,
      default: "customer", // 2types : customer, admin
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt; // 오타 수정
  delete obj.createdAt; // 오타 수정
  return obj;
};

// authController에서 token생성 (로그인)
// token생성도 async임을 명심하자.
userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
