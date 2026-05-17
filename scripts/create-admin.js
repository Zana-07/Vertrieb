const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const email    = process.argv[2];
const password = process.argv[3];
const name     = process.argv[4] || "Admin";

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password> [name]");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  const id = randomUUID();
  console.log("\nPaste this into Supabase → SQL Editor:\n");
  console.log(
    `INSERT INTO users (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt")\n` +
    `VALUES ('${id}', '${name}', '${email}', '${hash}', 'ADMIN', true, now(), now());`
  );
});
