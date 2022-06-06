import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config()

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction : false,
  serverKey : process.env.MIDTRANS_SB_SERVER,
  clientKey : process.env.MIDTRANS_SB_CLIENT,
});

export const verifyMidtransStatus  = (orderId) => {
  return snap.transaction.status(orderId)
    .then((res)=>{
      return res
    })
    .catch((err)=>{
      throw new Error(err)
    });
}

export default snap;