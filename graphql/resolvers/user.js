import {UserInputError} from 'apollo-server'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

import User from "../../models/User.js";
import {validateRegisterInput} from '../../utils/validators.js'

dotenv.config()
const salt = parseInt(process.env.HASH_SALT)

const userResolvers = {
  Mutation: {
    async register(proxy, {registerInput: {username, email, password, confirmPassword, about}}) {

      // Validate user registration data
      const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', {errors})
      } else {
        // TODO: Make sure email address or username doesn't already taken by other users
        const user = await User.find({$or: [{username}, {email}]})
        if (user.length > 0) {
          throw new UserInputError('Username is taken or email is registered', {
            errors: {
              username: "Username is taken",
              email: "Email address is registered"
            }
          })
        }
      }

      // TODO: encrypt the password
      password = await bcrypt.hash(password, salt)

      // TODO: make new user and save to MONGODB
      const newUser = new User({
        username,
        email,
        password,
        about
      })

      const res = await newUser.save()
      console.log(res)
      // TODO: Generate JWT

      return {}
    }
  }
}

export default userResolvers;