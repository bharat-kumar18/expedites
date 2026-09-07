require("dotenv").config();

const { spawn } = require("child_process");

const command = process.platform === "win32" ? "npx.cmd" : "npx";

const migration = spawn(
  command,
  ["node-pg-migrate", "up", "--database-url", process.env.DATABASE_URL],
  {
    stdio: "inherit",
    shell: true,
  }
);

migration.on("close", (code) => {
  process.exit(code);
});