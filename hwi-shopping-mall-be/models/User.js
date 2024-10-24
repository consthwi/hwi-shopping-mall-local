const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const User = mongoose.model("User", userSchema);
module.exports = User;
