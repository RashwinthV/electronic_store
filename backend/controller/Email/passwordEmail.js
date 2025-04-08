const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

// Random password generator with validation (min 6 chars, letter, number, special char)
const generateRandomPassword = (length = 10) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "@$&";

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  let password = [
    getRandom(letters),
    getRandom(numbers),
    getRandom(specialChars),
  ];

  const allChars = letters + numbers + specialChars;
  for (let i = password.length; i < Math.max(length, 6); i++) {
    password.push(getRandom(allChars));
  }

  return password.sort(() => Math.random() - 0.5).join("");
};

const sendPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email: email });
  if (!user)
    return res
      .status(404)
      .json({ message: "Please enter your registered email ID" });

  try {
    // Generate password
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Save to DB
    await User.updateOne({ email }, { password: hashedPassword });

    // Mail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,      
      },
    });

    // Styled HTML email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Your New Password - Secure Access",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4A90E2;">🔐 Password Reset</h2>
          <p>Hello <strong>${user.name || "User"}</strong>,</p>
          <p>We received a request to reset your account password. Your new temporary password is:</p>
          <p style="font-size: 18px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block; color: #333;">
            ${plainPassword}
          </p>
          <p style="margin-top: 20px;">For your security, please log in and change this password immediately.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">If you did not request this change, please contact our support team.</p>
          <p style="font-size: 12px; color: #999;">— E Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password sent to email successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Error sending email", error });
  }
};

module.exports = sendPasswordEmail;
