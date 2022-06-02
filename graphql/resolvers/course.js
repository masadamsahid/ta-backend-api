import {ForbiddenError, UserInputError} from "apollo-server";

import checkAuth from "../../utils/checkAuth.js";
import Course from "../../models/Course.js  ";
import User from "../../models/User.js";
import {validateCreateCourseInput, validateImageInput} from "../../utils/validators.js";


const courseResolvers = {
  Query:{
    async getCourses(parent, {page, pageSize}){

      try{
        const courses = await Course.find({})
          .sort({createdAt: 1})
          .skip((page-1) * pageSize)
          .populate('tutor')
          .limit(pageSize);
        const count = await Course.find({}).sort({createdAt: 1}).count()

        return {
          count: count,
          data: courses,
        }
      }catch (err) {
        throw new Error(err)
      }
    },
    async getCourse(parent, {courseCode}){
      try {
        const course = await Course.findOne({courseCode}).populate('tutor')
        if (!course){
          throw new Error('Course not found')
        }
        return course
      }catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    async createCourse(_ , {courseCode, title, tutor, description, price}, context) {

      /*TODO:
       * 1. Check loginAuth (NICE! COMPLETED ✔)
       * 2. Throw an Error if not logged in
       * 3. Check User's role
       * 4. Throw an Error if the role is not admin or tutor
       */
      const user = checkAuth(context)
      if(!(user.role === "admin" || user.role === "tutor")){
        throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
      }

      const {errors, valid} = validateCreateCourseInput(title,courseCode,tutor,price,description)
      if (!valid){
        throw new UserInputError('Input Error(s)', {errors})
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
      tutor = await User.findOne({username: tutor})
      if(!(user.role === "admin" || user.role === "tutor")){
        throw new UserInputError('This user cannot be tutor of a course')
      }
      const newCourse = new Course({
        courseCode,
        title,
        description,
        price,
        tutor: tutor._id,
        salesCount: 0,
        createdAt: new Date().toISOString()
      })
      const res = await newCourse.save().then((r)=> r.populate('tutor'))

      /*TODO: Return response (NICE! COMPLETED ✔)
       */
      return {
        ...res._doc,
        id: res._id,
      }
    },
    async deleteCourse(_, {courseCode}, context){

      /*TODO:
       * 1. Check user auth
       * 2. Check user's role
       * 3. Check if username is course tutor or not
       * */

      const user = checkAuth(context)

      try {
        const course = await Course.findOne({courseCode}).populate('tutor')

        if(user.username === course.tutor.username || user.role === 'admin'){
          await course.delete();
          return "Course successfully deleted"
        }else {
          throw new ForbiddenError('Unauthorized to do this action')
        }
      }catch (err){
        throw new Error(err)
      }
    },
    async editCourse(_, {courseId,courseCode,title,tutor,description,price}, context){
      const user = checkAuth(context);

      const course = await Course.findById(courseId).populate('tutor')

      if(user.username === course.tutor.username || user.role === 'admin'){

        course.courseCode = courseCode;
        course.title = title;
        course.description = description;
        course.price = price;

        if(tutor !== course.tutor.username){
          const newTutor = await User.findOne({username: tutor});
          if (!newTutor || newTutor.role === 'member'){
            throw new UserInputError('Tutor not found',{
              errors: {
                tutor: 'Could not find tutor with provided username',
              },
            });
          }
          course.tutor = newTutor;
        }
        const res = await course.save();

        return {
          ...res._doc,
          id: res._id,
        };
      }else {
        throw new ForbiddenError('Unauthorized to do this action');
      }
    },
    async uploadCourseThumbnail(_,{courseId,thumbnailImg},context){

      // Check inputs
      const {valid, errors} = validateImageInput(thumbnailImg);
      if (!valid){
        throw new UserInputError('Input Error(s)', {errors})
      }

      const user = checkAuth(context);

      if(!['admin','tutor'].includes(user.role)){
        throw new ForbiddenError('Unauthorized to do this action');
      }

      const course = await Course.findById(courseId).populate('tutor');

      if(user.role !== 'admin'){
        if (user.username !== course.tutor.username){
          throw new ForbiddenError('Unauthorized to do this action');
        }
      }

      course.thumbnailImg = thumbnailImg;

      try {
        const res = await course.save();
        return {
          ...res._doc,
          id: res._id
        }
      }catch(err){
        throw new Error(err);
      }

    },
    async removeCourseThumbnail(_,{courseId},context){

      const user = checkAuth(context);

      if(!['admin','tutor'].includes(user.role)){
        throw new ForbiddenError('Unauthorized to do this action');
      }

      const course = await Course.findById(courseId).populate('tutor').catch(err=>{
        if (err.name === 'CastError'){
          throw new UserInputError('Invalid input', {errors: {courseId: 'courseId doesn\'t match with any course'}})
        }
      });

      if(user.role !== 'admin'){
        if (user.username !== course.tutor.username){
          throw new ForbiddenError('Unauthorized to do this action');
        }
      }

      course.thumbnailImg = null;

      try {
        const res = await course.save();
        return {
          ...res._doc,
          id: res._id
        }
      }catch(err){
        throw new Error(err);
      }

    },
  }
}

export default courseResolvers;