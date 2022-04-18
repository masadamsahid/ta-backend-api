import {gql} from "apollo-server";

const typeDefs = gql`
    type Course{
        id: ID!
        courseCode: String!
        title: String!
        tutor: String!
        description: String!
        topics: [String]!
        price: Int!
        salesCount: Int!
        createdAt: String!
    }
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
        createCourse(
            courseCode: String,
            title: String,
            tutor: String,
            description: String,
            price: Float,
        ): Course!
    }
`

export default typeDefs;