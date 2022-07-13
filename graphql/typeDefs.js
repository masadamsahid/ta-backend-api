import {gql} from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    fullName: String!
    role: String!
    about: String
    token: String
    lastUpdate: String
    createdAt: String!
  }
  type Users { data: [User], count: Int! }

  type Topic{
    id: ID!
    topicTitle: String!
    orderNo: Int!
    videoId: String
    body: String
    lastUpdated: String
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
    discountedPrice: Int
    isDiscounted: Boolean!
    thumbnailImg: String
    createdAt: String!

    courseOrder: CourseOrder
  }
  type Courses { data: [Course], count: Int! }

  type CourseOrder {
    id: ID!
    orderId: String!
    midtransToken: String!
    redirectUrl: String!
    user: User!
    course: Course!
    amount: Float!
    midtransStatus: String!
    courseAccess: Boolean!
    updatedAt: String
    createdAt: String!
  }
  type CourseOrders { data: [CourseOrder], count: Int! }

  type Query{
    getUsers(page: Int!, pageSize: Int!, ): Users,
    getUser(username: String!): User

    getCourses(page: Int!, pageSize: Int!): Courses
    getCourse(courseCode: String!): Course

    getCourseOrder(orderId: String!): CourseOrder
    getCourseOrders(page: Int!, pageSize: Int!): CourseOrders
  }
  type Mutation {
    register(
      username: String!,
      fullName: String!,
      email: String!,
      password: String!,
      confirmPassword: String!,
      about: String,
    ): User!
    login(usernameEmail: String, password: String): User!
    editSelfUserProfile(id: String, about: String): User
    changeUserRole(targetUsername:String, changeRoleTo:String): User!

    createCourse(
      courseCode: String,
      title: String,
      tutor: String,
      description: String,
      price: Float,
      discountedPrice: Float,
      isDiscounted: Boolean!
    ): Course!
    editCourse(
      courseId: ID,
      courseCode: String,
      title: String,
      tutor: String,
      description: String,
      price: Float,
      discountedPrice: Float,
      isDiscounted: Boolean!
    ): Course!
    deleteCourse(courseCode: String!): String!
    uploadCourseThumbnail(courseId:ID!, thumbnailImg:String!):Course!
    removeCourseThumbnail(courseId:ID!):Course!

    addTopic(
      courseCode: String,
      topicTitle: String,
      orderNo: Int,
      videoId: String,
      body: String,
    ): Course!
    editTopic(
      oldOrderNo: Int,
      courseCode: String,
      topicTitle: String,
      orderNo: Int,
      videoId: String,
      body: String,
    ): Course!
    deleteTopic(courseCode: String!, orderNo:Int): Course!

    createCourseOrder(courseCode: String) : CourseOrder
  }
`

export default typeDefs;