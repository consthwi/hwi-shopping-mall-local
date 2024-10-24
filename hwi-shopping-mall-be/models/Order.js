const mongoose = require("mongoose");
const Product = require("./Product");
const User = require("./User");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    shipTo: {
      type: Object,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      default: "preparing",
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          default: 1,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
