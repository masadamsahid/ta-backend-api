import mongoose from "mongoose";

const courseOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true},
  midtransToken: {type: String, required: true},
  redirectUrl: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
  amount: {type: Number, required: true},
  midtransStatus: {
    type: String,
    enum: [
      "capture",
      "settlement",
      "pending",
      "deny",
      "cancel",
      "expire",
      "failure",
    ],
    required: true
  },
  courseAccess: {type: Boolean, default: false},
  updatedAt: String,
  createdAt: {type: String, required: true}
});

const CourseOrder = mongoose.model('CourseOrder', courseOrderSchema);

export default CourseOrder;