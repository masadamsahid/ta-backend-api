import {ForbiddenError, UserInputError} from "apollo-server";
import checkAuth from "../../utils/checkAuth.js";
import Course from "../../models/Course.js";


const topicResolvers = {
  Mutation: {
    async addTopic(parent, {courseCode, topicTitle, orderNo, videoUrl, body}, context) {

      /*TODO:
       * 1. Check is course exists
       * 2. Throw an Error if not exists
       */
      const course = await Course.findOne({courseCode}).populate('tutor')
      if (!course) {
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
      if (!(user.role === "admin" || user.role === "tutor")) {
        throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
      } else {
        /*TODO:
         * 1. Check is user an admin or user's username is same course tutor's username
         * 2. Throw an Error if requirement isn't fulfilled
         */
        if (user.role !== "admin" && user.username !== course.tutor.username) {
          throw new ForbiddenError('Unauthorized to do this action! Please contact admin!')
        }
      }

      /*TODO:
       * 1. Check if orderNo taken
       * 2. If taken, throw error
       */
      if (course.topics.find(topic => topic.orderNo === orderNo)) {
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
      course.topics.sort((a, b) => a.orderNo - b.orderNo)

      await course.save()

      return course
    },
    async deleteTopic(parent, {courseCode, orderNo}, context) {

      const user = checkAuth(context);

      try {
        const course = await Course.findOne({courseCode}).populate('tutor');

        if (user.username === course.tutor.username || user.role === 'admin') {
          course.topics = course.topics.filter((topic) => topic.orderNo !== orderNo)
          const res = await course.save()
          return {
            ...res._doc,
            id: res._id,
          };
        } else {
          throw new ForbiddenError('Unauthorized to do this action')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async editTopic(parent, {oldOrderNo, courseCode, topicId, topicTitle, orderNo, videoUrl, body}, context) {

      const user = checkAuth(context);

      try {
        const course = await Course.findOne({courseCode}).populate('tutor');

        if (user.username === course.tutor.username || user.role === 'admin') {

          // Get index of the topic want to be edited
          const idx = course.topics.findIndex((topic) => topic.orderNo === oldOrderNo)

          if (idx < 0) {
            throw new UserInputError('Topic not found', {
              errors: {
                topic: 'No topic with the provided order number'
              }
            });
          }

          // CHECK WHEN WANT TO CHANGE THE ORDER NUMBER
          if (oldOrderNo !== orderNo && course.topics.find(topic => topic.orderNo === orderNo)) {
            throw new UserInputError('Order number is used by another topic', {
              errors: {
                topic: 'Order number is taken by another topic'
              }
            });
          }

          course.topics[idx].courseCode = courseCode
          course.topics[idx].topicId = topicId
          course.topics[idx].topicTitle = topicTitle
          course.topics[idx].orderNo = orderNo
          course.topics[idx].videoUrl = videoUrl
          course.topics[idx].body = body
          course.topics[idx].lastUpdated = new Date().toISOString()

          // Sort the topics after push
          // so it is ordered by topic's orderNo
          course.topics.sort((a, b) => a.orderNo - b.orderNo)

          const res = await course.save()

          return {
            ...res._doc,
            id: res._id,
          }

        } else {
          throw new ForbiddenError('Unauthorized to do this action')
        }

      } catch (err) {
        throw new Error(err)
      }

    }
  }
}

export default topicResolvers;