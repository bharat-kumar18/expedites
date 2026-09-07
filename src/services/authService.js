const bcrypt = require("bcryptjs");

const {
  createUser,
  findUserByEmail,
} = require("../models/userModel");

const generateToken = require("../utils/generateToken");

const registerUser = async ({
  name,
  email,
  phone,
  password,
  role,
}) => {

  // Check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await createUser({
    name,
    email,
    phone,
    passwordHash,
    role,
  });

  // Generate JWT
  const token = generateToken(user);

  return {
    user,
    token,
  };
};

const loginUser = async ({
  email,
  password,
}) => {

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check status
  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active");
  }

  // Compare password
  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};