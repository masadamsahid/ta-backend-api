import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: String,
  title: String,
  tutor: String,
  description: String,
  topics: [String],
  price: Number,
  salesCount: Number,
  createdAt: String
})

const Course = mongoose.model('Course', courseSchema)

export default Course;