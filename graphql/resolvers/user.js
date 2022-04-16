import {UserInputError} from 'apollo-server'

import User from "../../models/User.js";
import {validateRegisterInput} from '../../utils/validators.js'


const userResolvers = {
  Mutation: {
    async register(proxy, {registerInput}) {
      const {username, email, password, confirmPassword, about} = registerInput;

      // Validate user registration data
      const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', {errors})
      } else {
        // TODO: Make sure email address or username doesn't already taken by other users
        const user = await User.find({ $or:[{username}, {email}]})
        if(user.length > 0){
          throw new UserInputError('Username is taken or email is registered', {
            errors: {
              username: "Username is taken",
              email: "Email address is registered"
            }
          })
        }
      }
      return {}
    }
  }
}

export default userResolvers;