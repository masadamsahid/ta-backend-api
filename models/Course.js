import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: {type: String, unique: true, required: true},
  title: {type: String, required: true},
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  price: {type: Number, required: true},
  createdAt: {type: String, required: true}
})

const Course = mongoose.model('Course', courseSchema)

export default Course;