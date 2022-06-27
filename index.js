import {ApolloServer, gql} from 'apollo-server'
import mongoose from "mongoose"
import  dotenv from 'dotenv'

import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'


dotenv.config()
const PORT = process.env.PORT || 5000
const MONGODB = process.env.MONGODB

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
})

mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(()=>{
    console.log("Connected to MongoDB Cloud!")
    return server.listen({ port: PORT})
  })
  .then((res) => {
  console.log(`Server running at ${res.url}`)
  })
  .catch((err) => {
    console.error(err)
  })