import userResolvers from './user.js'
import courseResolvers from "./course.js";

const resolvers = {
  Query: {
    sayHi: () => "Hello HI!"
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
  }
}

export default resolvers;