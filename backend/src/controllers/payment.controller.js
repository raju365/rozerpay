const productModel = require("../models/product.model");
const Razorpay = require("razorpay");
const paymentModel = require("../models/payment.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
  const product = await productModel.findOne();

  const options = {
    amount: product.price.amount,
    currency: product.price.currency,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);

    // Create a new payment record in the database
    const newPayment = await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: "PENDING",
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send({ error: "Failed to create order" });
  }
}
async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils.js')

    const result = validatePaymentVerification({ "order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, secret);
    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpay_order_id });
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = 'COMPLETED';
      await payment.save();
      res.json({ status: 'success' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }

}
module.exports = {
  createOrder,
  verifyPayment,
};
