const {
  fetchUsers,
  searchUsersService,
  filterUsersService,
  fetchUserById,
  editUser,
  changeUserStatus,
} = require("../services/userService");

const {
  updateUserSchema,
  updateStatusSchema,
} = require("../validations/userValidation");


// ========================================
// GET ALL USERS
// ========================================

const getUsers = async (req, res) => {

  try {

    const users =
      await fetchUsers();

    return res.status(200).json({

      success: true,

      message:
        "Users fetched successfully",

      count: users.length,

      data: users,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ========================================
// SEARCH USERS
// BODY BASED
// ========================================

const searchUsers = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
    } = req.body;


    // At least one search field
    if (!name && !email && !phone) {

      return res.status(400).json({

        success: false,

        message:
          "Please provide name, email or phone",

      });

    }


    const users =
      await searchUsersService({
        name,
        email,
        phone,
      });


    return res.status(200).json({

      success: true,

      message:
        "Users searched successfully",

      count: users.length,

      data: users,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ========================================
// FILTER USERS
// BODY BASED
// ========================================

const filterUsers = async (req, res) => {

  try {

    const {
      role,
      status,
    } = req.body;


    if (!role && !status) {

      return res.status(400).json({

        success: false,

        message:
          "Please provide role or status",

      });

    }


    const users =
      await filterUsersService({
        role,
        status,
      });


    return res.status(200).json({

      success: true,

      message:
        "Users filtered successfully",

      count: users.length,

      data: users,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ========================================
// GET ONE USER
// ID FROM BODY
// ========================================

const getUser = async (req, res) => {

  try {

    const { id } = req.body;


    if (!id) {

      return res.status(400).json({

        success: false,

        message: "User ID is required",

      });

    }


    const user =
      await fetchUserById(id);


    return res.status(200).json({

      success: true,

      message:
        "User fetched successfully",

      data: user,

    });

  } catch (error) {

    return res.status(404).json({

      success: false,

      message: error.message,

    });

  }

};


// ========================================
// UPDATE USER
// ID FROM BODY
// ========================================

const updateUser = async (req, res) => {

  try {

    const {
      id,
      name,
      email,
      phone,
    } = req.body;


    if (!id) {

      return res.status(400).json({

        success: false,

        message: "User ID is required",

      });

    }


    const { error } =
      updateUserSchema.validate({
        name,
        email,
        phone,
      });


    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.details[0].message,

      });

    }


    const user =
      await editUser(
        id,
        {
          name,
          email,
          phone,
        }
      );


    return res.status(200).json({

      success: true,

      message:
        "User updated successfully",

      data: user,

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};


// ========================================
// UPDATE STATUS
// ID + STATUS FROM BODY
// ========================================

const updateStatus = async (req, res) => {

  try {

    const {
      id,
      status,
    } = req.body;


    if (!id) {

      return res.status(400).json({

        success: false,

        message: "User ID is required",

      });

    }


    const { error } =
      updateStatusSchema.validate({
        status,
      });


    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.details[0].message,

      });

    }


    const user =
      await changeUserStatus(
        id,
        status
      );


    return res.status(200).json({

      success: true,

      message:
        `User status changed to ${status}`,

      data: user,

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};


module.exports = {
  getUsers,
  searchUsers,
  filterUsers,
  getUser,
  updateUser,
  updateStatus,
};