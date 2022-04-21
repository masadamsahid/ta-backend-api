import {ForbiddenError, UserInputError} from 'apollo-server'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from "../../models/User.js";
import {validateLoginInput, validateRegisterInput} from '../../utils/validators.js'
import checkAuth from "../../utils/checkAuth.js";

dotenv.config()
const SALT = parseInt(process.env.HASH_SALT)
const SECRETE_KEY = process.env.SECRET_KEY

function generateToken({id, username, email, role}) {
  return jwt.sign(
    {id, username, email, role},
    SECRETE_KEY,
    {expiresIn: "30 days"}
  )
}

const userResolvers = {
  Query: {
    async getUsers(parent, {page, pageSize}){
      try{
        const users = await User.find({}).sort({createdAt: 1}).skip((page-1) * pageSize).limit(pageSize);
        return users
      }catch (err) {
        throw new Error(err);
      }
    },
    async getUser(parent, {username}){
      try {
        const user = await User.findOne({username})
        if (!user){
          throw new Error('User not found')
        }
        return user
      }catch (err) {
        throw new Error(err)
      }
    }
  },
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
        about,
        role: "member",
        createdAt: new Date().toISOString()
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
    async login(proxy, {usernameEmail, password}) {

      // Validate user login data
      const {valid, errors} = validateLoginInput(usernameEmail, password)
      if (!valid) {
        throw new UserInputError('Errors', {errors})
      }

      // TODO: FIND USER BY USERNAME OR EMAIL ADDRESS
      const user = await User.findOne({$or: [{username: usernameEmail}, {email: usernameEmail}]})

      // TODO: HANDLE IF USER IS NOT FOUND
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('Errors', {errors})
      }

      // TODO: CHECK USER PASSWORD
      const match = await bcrypt.compare(password, user.password)
      if (!match){
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', {errors})
      }

      // TODO: GENERATE A JSON WEB TOKEN IF USERNAME-EMAIL AND PASSWORD VALID
      const token = generateToken(user);

      return {
          ...user._doc,
        id: user._id,
        token
      };
    },
    async changeUserRole(proxy, {targetUsername, changeRoleTo}, context){

      const user = checkAuth(context)

      /*TODO:
       * User
       */
      if (user.role !== "admin"){
        throw new ForbiddenError('Unauthorized to do this action')
      }

      const targetUser = await User.findOne({username: targetUsername})

      targetUser.role = changeRoleTo

      const res = await targetUser.save()

      return {
        ...res._doc,
        id: res._id
      }
    }
  }
}

export default userResolvers;