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
        let user = await User.find({ $or:[{ username, email }]})
        console.log(user)
      }
      return {}
    }
  }
}

export default userResolvers;