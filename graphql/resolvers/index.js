import userResolvers from './user.js'
import courseResolvers from "./course.js";
import topicResolvers from "./topic.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...courseResolvers.Query,
    sayHi: () => "Hello HI!",
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...topicResolvers.Mutation,
  }
}

export default resolvers;