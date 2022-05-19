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
        tutor: User
        description: String!
        topics: [Topic]!
        price: Int!
        createdAt: String!
    }
    type CourseOrder {
        id: ID
        orderId: String
        midtransToken: String
        redirectUrl: String
        user: User
        course: Course
        amount: Float
        midtransStatus: String
        courseAccess: Boolean
        updatedAt: String
        createdAt: String
    }
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
        about: String!
        token: String!
        lastUpdate: String!
        createdAt: String!
    }
    type Users { data: [User], count: Int! }
    type Courses { data: [Course], count: Int! }
    type CourseOrders { data: [CourseOrder], count: Int! }
    input RegisterInput{
        username: String!
        fullName: String!
        email: String!
        password: String!
        confirmPassword: String!
        about: String
    }
    type Query{
        sayHi: String!
        getUsers(page: Int, pageSize: Int, ): Users,
        getUser(username: String): User
        
        getCourses(page: Int, pageSize: Int): Courses
        getCourse(courseCode: String): Course
        
        getCourseOrder(orderId: String): CourseOrder
        getCourseOrders(page: Int, pageSize: Int): CourseOrders
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(usernameEmail: String, password: String): User!
        changeUserRole(targetUsername:String, changeRoleTo:String): User!
        editSelfUserProfile(id: String, about: String): User
        
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
        
        createCourseOrder(courseCode: String) : CourseOrder
    }
`

export default typeDefs;