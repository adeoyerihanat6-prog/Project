
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }                                   

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createUser = async (req, res) => {
  try {
    const { Fullname, email, Password, role } = req.body;

    console.log("createUser req.body:", req.body);

    if (!Fullname || !email || !Password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const checkUser = await User.findOne({
      email: normalizedEmail,
    });

    if (checkUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Fullname,
      email: normalizedEmail,
      Password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message:
          "Email configuration missing. Set EMAIL_USER and EMAIL_PASS in .env",
      });
    }

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

   

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "You’re In!! 🎉",
      html: `<p>Welcome ${Fullname} 💖</p>`,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { Fullname, email, Password, role } = req.body;

    let updateData = { Fullname, email, role };

    if (Password) {
      updateData.Password = await bcrypt.hash(Password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );


    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






const login = async (req, res) => {
  try {
    const { email, Password } = req.body;

    if (!email || !Password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      Password,
      user.Password
    );

    if (!isMatch) {
      return res.status(400).json({
          message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Save token in cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        Fullname: user.Fullname,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getAllUsers, getUserById, createUser, updateUser, deleteUser, login};

 