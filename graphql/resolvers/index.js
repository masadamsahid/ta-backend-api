import userResolvers from './user.js'

const resolvers = {
  Query: {
    sayHi: () => "Hello HI!"
  },
  Mutation: {
    ...userResolvers.Mutation
  }
}

export default resolvers;