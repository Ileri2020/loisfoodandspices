import mongoose from "mongoose";
// schema need review especially for product list
const SalesSchema = new mongoose.Schema({
    products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
          productQuantity: { type: Number, required: true },
          productPrice: { type: Number, required: true },
          productCost: {type: Number, required: true },
        }
    ],
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    discount: {type: Number, required: true },
    totalCost: {type: Number, required: true },
    totalSale: {type: Number, required: true },
    totalQty: {type: Number},
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'] },
    paymentMethod: { type: String},
    paymentStatus: { type: String, enum: ['paid', 'unpaid'] },
});

const Sale = mongoose.model("Sales", SalesSchema);

export default Sale;