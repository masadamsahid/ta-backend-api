import {ForbiddenError, UserInputError} from "apollo-server";
import checkAuth from "../../utils/checkAuth.js";
import Course from "../../models/Course.js";


const topicResolvers = {
  Mutation: {
    async addTopic(proxy, {courseCode, topicTitle, orderNo, videoUrl, body}, context){
      console.log("t7est")

      /*TODO:
       * 1. Check is course exists
       * 2. Throw an Error if not exists
       */
      const course = await Course.findOne({courseCode})
      if (!course){
        throw new UserInputError('Course not found', {
          errors: {
            courseCode: 'Invalid course code'
          }
        })
      }

      /*TODO:
       * 1. Check loginAuth
       * 2. Throw an Error if not logged in
       * 3. Check User's role
       * 4. Throw an Error if the role is not admin or tutor
       */
      const user = checkAuth(context)
      if(!(user.role === "admin" || user.role === "tutor")){
        throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
      }else{
        /*TODO:
         * 1. Check is user an admin or user's username is same course tutor's username
         * 2. Throw an Error if requirement isn't fulfilled
         */
        if(user.role !== "admin" && user.username !== course.username){
          throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
        }
      }

      /*TODO:
       * 1. Check if orderNo taken
       * 2. If taken, throw error
       */
      if (course.topics.find(topic => topic.orderNo === orderNo)){
        throw new UserInputError('Order number is used by another topic', {
          errors: {
            topic: 'Order number is taken by another topic'
          }
        })
      }

      /*TODO:
       * 1. Update course topic
       */
      course.topics.push({
        topicTitle,
        orderNo,
        videoUrl,
        body,
        createdAt: new Date().toISOString()
      });

      // Sort the topics field after push
      // so it is ordered by topic's orderNo
      course.topics.sort((a,b) => a.orderNo - b.orderNo)

      await course.save()

      return course

    }
  }
}

export default topicResolvers;