const express = require("express");
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();

// token으로 userId확인 후(미들웨어), userId의 admin권한을 확인한 후(미들웨어), 상품을 생성한다.
router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct
);

module.exports = router;
