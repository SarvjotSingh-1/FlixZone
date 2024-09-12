// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now, index: { expires: 300 } }, // 5 minutes expiration
// });

// const OTP = mongoose.model("OTP", otpSchema);

// export default OTP;


// import mongoose from 'mongoose';

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   expiresAt: { type: Date, required: true },
// });

// export default mongoose.model('OTP', otpSchema);


import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true }, // Added index
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index to automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OTP', otpSchema);