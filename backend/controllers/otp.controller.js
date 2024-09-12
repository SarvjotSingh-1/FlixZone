// // otp.controller.js
// import { OTP } from "../models/otp.model.js"; // Adjust the import according to your setup

// export const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Find the OTP document by email
//     const otpRecord = await OTP.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP not found or expired" });
//     }

//     // Check if the OTP matches
//     if (otpRecord.otp === otp) {
//       return res.status(200).json({ message: "OTP verified successfully" });
//     } else {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// };



// otp.controller.js
import OTP from "../models/otp.model.js";

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is valid, delete it and proceed
    await OTP.deleteOne({ email, otp });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
