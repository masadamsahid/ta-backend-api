import checkAuth from "../../utils/checkAuth.js";


const courseResolvers = {
  Mutation: {
    async createCourse(proxy , {courseCode, title, tutor, description, price}, context) {

      /*TODO:
       * 1. Check loginAuth
       * 2. Throw an Error if not logged in
       * 3. Check User's role
       * 4. Throw an Error if the role is not admin or tutor
       */
      const user = checkAuth(context)
      console.log(user)

      /*TODO:
       * 1. Check Course with courseCode already exists or not
       * 2. Handle if Course already exists by throwing an Error
       */

      /*TODO:
       * 1. Create a new Course
       * 2. Save the new Course
       */

      /*TODO: Return response
       */

    }
  }
}

export default courseResolvers;