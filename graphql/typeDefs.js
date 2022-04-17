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
    input RegisterInput{
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
        about: String!
    }
    type Query{
        sayHi: String!
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(usernameEmail: String, password: String): User!
    }
`

export default typeDefs;