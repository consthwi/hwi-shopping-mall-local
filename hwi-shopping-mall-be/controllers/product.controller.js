const Product = require("../models/Product");

const PAGE_SIZE = 3;
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    const product = new Product({
      sku: sku,
      name: name,
      size: size,
      image: image,
      category: category,
      description: description,
      price: price,
      stock: stock,
      status: status,
    });
    await product.save();
    res.status(200).json({ status: "ok", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    // serachQuery를 이용한 검색 로직
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: "i" } } : {};
    // 동적인 응답 위한 객체
    let response = { status: "ok" };
    let query = Product.find(cond);

    // 페이지네이션 로직
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      // 최종 페이지 = 데이터사이즈 / PAGE_SIZE
      const totalItemNum = await Product.find(cond).countDocuments();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }
    // 페이지네이션 로직 end

    const productList = await query.exec();
    response.products = productList;

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
