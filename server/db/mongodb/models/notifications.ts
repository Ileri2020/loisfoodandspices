import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    category: { type:String, enum: ['suggestion', 'complaint', 'advertise', 'comment', "reply", "general"], required: true },
    message: { type: String},
    read: { type: Boolean, default: false },
  });


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;