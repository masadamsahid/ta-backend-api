import {gql} from "apollo-server";

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        about: String!
        token: String!
        createdAt: String!
    }
    type Query{
        sayHi: String!
    }
`

export default typeDefs;