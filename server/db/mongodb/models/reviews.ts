import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    rating: { type: Number, min: 1, max: 5},
    comment: { type: String},
  });


  const Review = mongoose.model("Review", reviewSchema);

  export default Review;