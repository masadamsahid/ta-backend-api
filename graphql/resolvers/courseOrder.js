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
  return snap.transaction.status(orderId)
    .then((res)=>{
      return res
    })
    .catch((err)=>{
      throw new Error(err)
    });
}

const courseOrderResolvers = {
  Query:{
    async getCourseOrders(_, { page, pageSize }, context){

      const user = checkAuth(context)

      const courseOrders = await CourseOrder.find({})
        .sort({createdAt: 1})
        .skip((page-1) * pageSize)
        .limit(pageSize)
        .populate(['user','course'])

      courseOrders.map(async (courseOrder) => {
        const {transaction_status} = await verifyMidtransStatus(courseOrder.orderId).catch(()=> {
          return {transaction_status: null}
        });

        if (transaction_status !== courseOrder.midtransStatus && transaction_status !== null){
          courseOrder.midtransStatus = transaction_status
          if (courseOrder.midtransStatus === 'capture' || courseOrder.midtransStatus === 'settlement'){
            courseOrder.courseAccess = true
          }else {
            courseOrder.courseAccess = false
          }
          const res = await courseOrder.save()
          return {
            ...res._doc,
            id: res.id
          }
        }
      });

      const count = await CourseOrder.find({})
        .sort({createdAt: 1})
        .count()


      return {
        count: count,
        data: courseOrders,
      };

    },
    async getCourseOrder(_, {orderId}, context){

      const user = checkAuth(context)

      const {transaction_status} = await verifyMidtransStatus(orderId).catch(()=> {
        return {transaction_status: null}
      })

      const courseOrder = await CourseOrder.findOne({orderId}).populate(['user', 'course'])

      if (transaction_status !== courseOrder.midtransStatus && transaction_status !== null){
        courseOrder.midtransStatus = transaction_status
        if (courseOrder.midtransStatus === 'capture' || courseOrder.midtransStatus === 'settlement'){
          courseOrder.courseAccess = true
        }else {
          courseOrder.courseAccess = false
        }
        const res = await courseOrder.save()
        return {
          ...res._doc,
          id: res.id
        }
      }

      return {
        ...courseOrder._doc,
        id: courseOrder._id
      }

    },
  },
  Mutation: {
    async createCourseOrder(_,{courseCode}, context){

      const user = await User.findById(checkAuth(context).id)
      if (!user) throw new Error('User not registered')

      const course  = await Course.findOne({courseCode})

      if(!course){
        throw new Error('Course not found')
      }

      const courseOrder = new CourseOrder({
        orderId: `COURSE${courseCode}${user.username}-${new Date().toISOString()}`,
        course: course._id,
        amount: course.price,
        user: user._id,
        midtransStatus: "pending",
        courseAccess: false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
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
          const res = await courseOrder.save().then(r => r.populate(['user', 'course']))
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