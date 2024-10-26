const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// 1. 회원가입
router.post("/", userController.createUser);
// 2. 토큰 로그인 (header에서 토큰을 받기 때문에 body불필요, get사용)
// 2-1. 토큰의 validation (authController, 미들웨어)
// 2-2. 토큰 해당 유저 return (userController)
router.get("/me", authController.authenticate, userController.getUser);

module.exports = router;
