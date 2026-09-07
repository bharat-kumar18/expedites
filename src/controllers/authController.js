const {
  registerUser,
  loginUser,
} = require("../services/authService");

const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");


const register = async (req, res) => {
  try {

    const { error } =
      registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result =
      await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


const login = async (req, res) => {
  try {

    const { error } =
      loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result =
      await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  register,
  login,
};