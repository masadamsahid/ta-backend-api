import {AuthenticationError} from 'apollo-server'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const checkAuth = (context) => {
  // context = { ...headers }
  const authHeader = context.req.headers.authorization;
  if(authHeader){

    const token = authHeader.split('Bearer ')[1];
    if (token){
      try{
        const user = jwt.verify(token, SECRET_KEY)
        return user;
      } catch (err){
        throw new AuthenticationError('Token invalid or expired')
      }
    }
    throw new Error('Authentication token must be \'Bearer [token]\'')
  }
  throw new Error('Authorization header must be provided')

}

export default checkAuth;