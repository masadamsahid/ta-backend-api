import {UserInputError} from 'apollo-server'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from "../../models/User.js";
import {validateLoginInput, validateRegisterInput} from '../../utils/validators.js'

dotenv.config()
const SALT = parseInt(process.env.HASH_SALT)
const SECRETE_KEY = process.env.SECRET_KEY

function generateToken({ id, username, email }){
  return jwt.sign(
    { id, username, email },
    SECRETE_KEY,
    { expiresIn: "30 days"}
    )
}

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
      password = await bcrypt.hash(password, SALT)

      // TODO: make new user and save to MONGODB
      const newUser = new User({
        username,
        email,
        password,
        about
      })

      const res = await newUser.save()
      // TODO: Generate JWT
      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async login (proxy, {usernameEmail, email}){

      // Validate user login data
      const { valid, errors } = validateLoginInput(usernameEmail, email)
      if(!valid){
        throw new UserInputError('Errors', {errors})
      }

      // TODO: FIND USER BY USERNAME OR EMAIL ADDRESS
      // TODO: HANDLE IF USER IS NOT FOUND
      // TODO: CHECK USER PASSWORD
      // TODO: GENERATE A JSON WEB TOKEN IF USERNAME-EMAIL AND PASSWORD VALID
    }
  }
}

export default userResolvers;