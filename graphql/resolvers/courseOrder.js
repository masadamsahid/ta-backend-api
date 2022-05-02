import midtransClient from "midtrans-client";
import dotenv from "dotenv";

import User from "../../models/User.js";
import Course from "../../models/Course.js";
import CourseOrder from "../../models/CourseOrder.js";

import checkAuth from "../../utils/checkAuth.js";

dotenv.config()

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction : false,
  serverKey : process.env.MIDTRANS_SB_SERVER,
  clientKey : process.env.MIDTRANS_SB_CLIENT,
});

const verifyMidtransStatus  = (orderId) => {
  snap.transaction.status(orderId)
    .then((res)=>{
      return res
    })
    .catch((err)=>{
      throw new Error(err)
    });
}

const courseOrderResolvers = {
  Query:{
    async getCourseOrder(_, {orderId}, context){
      const res = verifyMidtransStatus(orderId)
      console.log(res)
    },
  },
  Mutation: {
    async createCourseOrder(_,{courseCode}, context){

      const user = await User.findById(checkAuth(context).id)

      const course  = await Course.findOne({courseCode})

      if(!course){
        throw new Error('Course not found')
      }

      const courseOrder = new CourseOrder({
        orderId: `COURSE${courseCode}${user.username}-${new Date().toISOString()}`,
        courseId: course._id,
        amount: course.price,
        userId: user._id,
        midtransStatus: "pending",
        courseAccess: false,
        createdAt: new Date().toISOString()
      })

      const parameter = {
        "transaction_details": {
          "order_id": courseOrder.orderId,
          "gross_amount": courseOrder.amount
        },
        "credit_card":{
          "secure" : true
        }
      };

      return snap.createTransaction(parameter)
        .then(async transaction => {
          courseOrder.midtransToken = transaction.token
          courseOrder.redirectUrl = transaction.redirect_url
          console.log("transactionURL:", transaction.redirect_url)
          const res = await courseOrder.save()
          console.log("===== Course order SAVED successfully =====")
          return {
            ...res._doc,
            id: res._id
          }
        })
        .catch((err)=>{
          throw new Error(err)
        })

    }
  }
}

export default courseOrderResolvers;