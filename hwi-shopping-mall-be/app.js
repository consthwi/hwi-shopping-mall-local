// 기본 세팅
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");

// 기본 시동
const app = express();
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // req.body 객체로 인식하게 함

// api 라우팅
app.use("/api", indexRouter);

// 데이터베이스 세팅
const mongoURI = process.env.MONGODB_URI_PROD;
console.log(`mogoURI: ${process.env.MONGODB_URI_PROD}`);
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongoose connected"))
  .catch((error) => console.log("DB connection failed", error));

app.listen(process.env.PORT || 5000, () => {
  console.log(`server on ${process.env.PORT || 5000}`);
});
