import axios from 'axios';
import React from 'react'

const PaymentButton = () => {
    const handlePayment = async () => {
        try {
            //step 1: create order on backend server
            const {data:order} = await axios.post("http://localhost:3000/api/payments/create-order");
            // step 2: razorpay options
            const options = {
                key: "rzp_test_Tka2nKuu1MiYFi", // Replace with your Razorpay API key
                amount: order.amount,
                currency: order.currency,
                name: "My Company",
                description: "Test Transaction",
                order_id: order.id,
                handler: async function (response) {
                    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = response;
                    // Step 3: Verify payment on backend server
                    try{
                        await axios.post("http://localhost:3000/api/payments/verify-payment",{
                            razorpay_order_id: razorpay_order_id,
                            razorpay_payment_id: razorpay_payment_id,
                            razorpay_signature: razorpay_signature
                        });
                        alert("Payment successful!");
                    }
                    catch(error){
                        console.error("Payment verification failed:", error);
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "test@example.com",
                    contact: "9999999999"
                },
                theme:{
                    color:"#3399cc"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        }
        catch (error) {
            console.error("Error creating order:", error);
        }
    }
  return (
   <button onClick={handlePayment} style={{ padding: "10px 20px", background: "#3399cc", color: "#fff", border: "none", borderRadius: "5px" }}>
      Pay Now
    </button>
  )
}

export default PaymentButton
