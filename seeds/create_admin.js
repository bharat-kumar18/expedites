const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  const email = "expedite@courier.com";

  // Check if admin already exists
  const existingAdmin = await knex("users")
    .where({ email })
    .first();

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  // Admin password
  const password = "Admin@12345";

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert admin
  await knex("users").insert({
    name: "Expedite",
    email: email,
    phone: "9874563210",
    password_hash: passwordHash,
    role: "ADMIN",
    status: "ACTIVE",
  });

  console.log("Admin created successfully");
};