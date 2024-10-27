const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");

// router1 유저관련 (회원가입, 로그인)
router.use("/user", userApi);
// router2 권한관련 (DB유저판단, admin권한판단, 미들웨어)
router.use("/auth", authApi);
// router3 제품관련
router.use("/product", productApi);

module.exports = router;
