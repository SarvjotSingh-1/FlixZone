import express from "express";
import OTP from "../models/otp.model.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    upperCase: false,
    lowerCase: false,
  });

  // Save OTP to database with an expiration time
  const otpDoc = new OTP({
    email,
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // OTP valid for 15 minutes
  });

  try {
    await otpDoc.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).send(err.toString());
      res.status(200).send("OTP sent successfully");
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpDoc = await OTP.findOne({ email, otp });

    if (!otpDoc) return res.status(400).send("Invalid OTP");
    if (otpDoc.expiresAt < Date.now())
      return res.status(400).send("OTP expired");

    // OTP is valid
    await OTP.deleteOne({ email, otp });
    res.status(200).send("OTP verified successfully");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

export default router;




