
const crypto = require("node:crypto");

for (let meja = 1; meja <= 4; meja++) {
  const nomorMeja = String(meja).padStart(2, "0");
  const token = crypto.randomBytes(16).toString("hex");

  console.log(`"${nomorMeja}": "${token}",`);
}
