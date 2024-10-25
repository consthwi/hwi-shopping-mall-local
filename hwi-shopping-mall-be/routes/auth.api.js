const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginWithEmail);
// get은 절대 body를 받지 않는다.

module.exports = router;
