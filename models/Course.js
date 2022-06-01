import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: String,
  title: String,
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  thumbnailImg: String,
  description: String,
  topics: {type :[
      {
        topicTitle: String,
        orderNo: Number,
        videoUrl: String,
        body: String,
        lastUpdated: String,
        createdAt: String
      }
    ], default: []},
  price: Number,
  createdAt: String
})

const Course = mongoose.model('Course', courseSchema)

export default Course;