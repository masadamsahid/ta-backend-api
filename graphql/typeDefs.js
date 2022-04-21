import {gql} from "apollo-server";

const typeDefs = gql`
    type Topic{
        id: ID!
        topicTitle: String!
        orderNo: Int!
        videoUrl: String!
        body: String!
        lastUpdated: String!
        createdAt: String!
    }
    type Course{
        id: ID!
        courseCode: String!
        title: String!
        tutor: String!
        description: String!
        topics: [Topic]!
        price: Int!
        salesCount: Int!
        createdAt: String!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        role: String!
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
        getUsers(page: Int, pageSize: Int, ):[User],
        getUser(username: String): User
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(usernameEmail: String, password: String): User!
        changeUserRole(targetUsername:String, changeRoleTo:String): User!
        createCourse(
            courseCode: String,
            title: String,
            tutor: String,
            description: String,
            price: Float,
        ): Course!
        deleteCourse(courseCode: String): String!
        addTopic(
            courseCode: String,
            topicTitle: String,
            orderNo: Int,
            videoUrl: String,
            body: String,
        ): Course!
    }
`

export default typeDefs;