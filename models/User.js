import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  about: String,
  createdAt: String,
})

const User = model('User', userSchema)

export default User;