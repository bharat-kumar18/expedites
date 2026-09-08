const {
  getAllUsers,
  searchUsers,
  filterUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} = require("../models/userManagementModel");


// ========================================
// GET ALL USERS
// ========================================

const fetchUsers = async () => {

  return await getAllUsers();

};


// ========================================
// SEARCH USERS
// ========================================

const searchUsersService = async ({
  name,
  email,
  phone,
}) => {

  return await searchUsers({
    name,
    email,
    phone,
  });

};


// ========================================
// FILTER USERS
// ========================================

const filterUsersService = async ({
  role,
  status,
}) => {

  return await filterUsers({
    role,
    status,
  });

};


// ========================================
// GET SINGLE USER
// ========================================

const fetchUserById = async (id) => {

  const user =
    await getUserById(id);

  if (!user) {

    throw new Error(
      "User not found"
    );

  }

  return user;

};


// ========================================
// UPDATE USER
// ========================================

const editUser = async (
  id,
  data
) => {

  const user =
    await getUserById(id);

  if (!user) {

    throw new Error(
      "User not found"
    );

  }


  // Admin cannot be modified
  if (user.role === "ADMIN") {

    throw new Error(
      "Admin account cannot be modified here"
    );

  }


  return await updateUser(
    id,
    data
  );

};


// ========================================
// CHANGE USER STATUS
// ========================================

const changeUserStatus = async (
  id,
  status
) => {

  const user =
    await getUserById(id);

  if (!user) {

    throw new Error(
      "User not found"
    );

  }


  // Admin cannot be changed
  if (user.role === "ADMIN") {

    throw new Error(
      "Admin status cannot be changed"
    );

  }


  return await updateUserStatus(
    id,
    status
  );

};


module.exports = {
  fetchUsers,
  searchUsersService,
  filterUsersService,
  fetchUserById,
  editUser,
  changeUserStatus,
};