const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    
  },
  signature: {
    type: String,
    },
  price:{
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    }
  },
  
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
},{timestamps: true});

module.exports = mongoose.model("Payment", paymentSchema);
