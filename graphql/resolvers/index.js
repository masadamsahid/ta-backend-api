import userResolvers from './user.js'
import courseResolvers from "./course.js";
import topicResolvers from "./topic.js";
import courseOrderResolvers from "./courseOrder.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...courseOrderResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...topicResolvers.Mutation,
    ...courseOrderResolvers.Mutation,
  }
}

export default resolvers;