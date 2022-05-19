import mongoose from 'mongoose'



const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  fullName: {type: String, default: '-'},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {
    type: String,
    enum: ["admin", "member", "tutor"]
  },
  about: String,
  createdAt: String,
})

const User = mongoose.model('User', userSchema)

export default User;