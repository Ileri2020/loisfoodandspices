import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
    paymentMethod: { type: String},
    paymentStatus: { type: String, enum: ['paid', 'unpaid'] },
    amount: { type: Number},
    transactionId: { type: String},
  });



const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;




