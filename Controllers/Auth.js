const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("../Models/User");
const Reset = require("../Models/Reset");
const { sendEmail } = require("../Services/SendEmail");
const { CreateNotification } = require("../Services/Notification");

exports.signup = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const { first_name, last_name } = req.body;
  const user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        userType: "Admin",
        first_name,
        last_name,
        user_image,
      });

      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User Created!",
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email, userType: "Admin" });
    if (!user)
      return res.status(401).json({
        message: "Email Doesn't Exist",
      });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual)
      return res.status(401).json({
        message: "Invalid Password",
      });

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ezSADJHNB_SADFQsxczxdsf"
    );

    await res.status(200).json({
      token: token,
      userId: user._id.toString(),
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "Email is not registered on the platform.",
        error: true,
      });
    }
    const code = Math.floor(10000 + Math.random() * 900000);
    const token = await Reset.findOne({ email: user.email });
    if (token) await token.remove();
    const newToken = new Reset({
      email: user.email,
      code: code,
    });
    const savedToken = await newToken.save();
    await User.findOneAndUpdate({ _id: user._id }, { resetCode: code });
    await sendEmail(user.email, code);
    return res.status(200).json({
      message: "We have e-mailed your password reset code!",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: true });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { token } = req.body;
    const success = await Reset.findOne({ code: token });
    if (!success) {
      return res.status(400).json({
        message: "This code is not valid. OR Your code may have expired.",
        error: true,
      });
    }
    return res.status(200).json({
      message: "Token Accepted Successfully",
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: true });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const result = await Reset.findOne({ code: token });
    if (!result) {
      console.log("RESULT");
      return res.status(400).json({
        message: "Invalid code Or your code may have expired",
        error: true,
      });
    }
    const user = await User.findOne({ email: result.email });
    if (!user) {
      console.log("USER");
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("VALID PASSWORD", validPassword);
    if (validPassword)
      return res.status(400).json({
        message: "Please type new password which is not used earlier",
      });
    user.password = await bcrypt.hash(password, 12);
    result.remove();
    await User.findOneAndUpdate(
      { email: result.email },
      { password: user.password }
    );
    return res
      .status(200)
      .json({ message: "Password Reset Successfully", error: false });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: true });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      sports,
      phone_number,
      birthday,
      height,
      weight,
      high_school_graduation_year,
      city,
      state,
      country,
      position,
      role,
      parents_details,
    } = req.body;
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (user_image) fs.unlink(user_image, () => {});
      return res.status(400).json({ message: "Already Registered" });
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const parsedParentsDetails = JSON.parse(parents_details);
    const user = new User({
      email,
      password: hashedPw,
      first_name,
      last_name,
      userType: "User",
      sports,
      phone_number,
      birthday,
      height,
      weight,
      high_school_graduation_year,
      city,
      state,
      country,
      position,
      role,
      parents_details: parsedParentsDetails,
      user_image,
    });
    await user.save();
    await res.status(201).json({
      message: "User Registered",
    });
    await CreateNotification({
      message: "New User Registered",
      to: "Admin",
      payload: {
        payloadType: "New-User",
        id: user._id,
      },
    });
  } catch (err) {
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (user_image) fs.unlink(user_image, () => {});
    return res.status(500).json({ message: err.toString() });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email, userType: "User" });
    if (!user)
      return res.status(401).json({
        message: "Email Doesn't Exist",
      });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual)
      return res.status(401).json({
        message: "Invalid Password",
      });
    if (!user.status)
      return res.status(400).json({
        message:
          user.isApproved === "Pending"
            ? "Your account hasn't been approved by the admin yet."
            : "Your acccount registration request has been rejected by the admin. Please contact admin for further information.",
      });

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVPxzcsad"
    );

    await res.status(200).json({
      token: token,
      userId: user._id.toString(),
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;

  try {
    if (password === newPassword) {
      res.status(422).json({
        message: "Old password and new password can't be same",
      });
      return false;
    }
    if (newPassword !== confirmPassword) {
      res.status(422).json({
        message: "New password and confirm password not equal",
      });
      return false;
    } else {
      try {
        const user = await User.findById(req.userId);
        if (!user) {
          const error = new Error("User not found");
          error.statusCode = 401;
          throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
          const error = new Error("Invalid Password");
          error.statusCode = 401;
          throw error;
        }
        hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        await res.status(201).json({
          message: "Password Changed!",
        });
      } catch (err) {
        if (err.statusCode === 401) {
          res.status(401).json({
            message: "Invalid Password",
            err: err.toString(),
          });
        } else {
          res.status(500).json({
            message: "Internal Server Error",
            err: err.toString(),
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};
