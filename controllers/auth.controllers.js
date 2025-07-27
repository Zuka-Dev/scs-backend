import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../database/prisma.js";
dotenv.config();
export const registerUser = async (req, res) => {
  const { name, matricNumber, email, role, password } = req.body;
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Check if role is valid
  const validRoles = ["admin", "student"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const newUser = await prisma.user.create({
    data: {
      name,
      matricNumber,
      email,
      role,
      password: bcrypt.hashSync(password, 10),
    },
  });

  if (!newUser) {
    return res.status(500).json({ message: "Error creating user" });
  }
  res
    .status(201)
    .json({ message: "User registered successfully", user: { name } });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if password is correct
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Login successful", token, role: user.role });
};

export const getUserDetails = async (req, res) => {
  const userId = req.user.id;

  // Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Exclude password from the response
  const { password, ...userDetails } = user;

  res.status(200).json({ message: "User details fetched successfully", userDetails });
}
