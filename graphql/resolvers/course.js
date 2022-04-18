import {ForbiddenError, UserInputError} from "apollo-server";

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
      console.log(user)
      if(!(user.role === "admin" || user.role === "tutor")){
        throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
      }

      /*TODO:
       * 1. Check Course with courseCode already exists or not (NICE! COMPLETED ✔)
       * 2. Handle if Course already exists by throwing an Error (NICE! COMPLETED ✔)
       */
      const course = await Course.findOne({courseCode})
      if (course){
        throw new UserInputError('Course code already taken', {
          errors: {
            courseCode: 'This course code is taken'
          }
        })
      }

      /*TODO:
       * 1. Create a new Course (NICE! COMPLETED ✔)
       * 2. Save the new Course (NICE! COMPLETED ✔)
       */
      const newCourse = new Course({
        courseCode,
        title,
        tutor,
        description,
        price,
        salesCount: 0,
        createdAt: new Date().toISOString()
      })
      const res = await newCourse.save()

      /*TODO: Return response (NICE! COMPLETED ✔)
       */
      return {
        ...res._doc,
        id: res._id,
      }

    }
  }
}

export default courseResolvers;