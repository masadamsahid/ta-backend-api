import checkAuth from "../../utils/checkAuth.js";
import Course from "../../models/Course.js  ";


const courseResolvers = {
  Mutation: {
    async createCourse(proxy , {courseCode, title, tutor, description, price}, context) {

      /*TODO:
       * 1. Check loginAuth (NICE! COMPLETED ✔)
       * 2. Throw an Error if not logged in
       * 3. Check User's role
       * 4. Throw an Error if the role is not admin or tutor
       */
      const user = checkAuth(context)

      /*TODO:
       * 1. Check Course with courseCode already exists or not
       * 2. Handle if Course already exists by throwing an Error
       */

      /*TODO:
       * 1. Create a new Course
       * 2. Save the new Course
       */
      const course = new Course({
        courseCode,
        title,
        tutor,
        description,
        price,
        salesCount: 0,
        createdAt: new Date().toISOString()
      })
      const res = await course.save()

      /*TODO: Return response
       */
      return {
        ...res._doc,
        id: res._id,
      }

    }
  }
}

export default courseResolvers;