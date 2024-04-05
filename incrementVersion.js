const semver = require("semver");
const fs = require("fs");
const path = require("path");

// 更新 VUE_APP_VERSION 环境变量
const envFilePath = path.resolve(__dirname, ".env");
// 读取已存在的环境变量
let envContent = "";
try {
  envContent = fs.readFileSync(envFilePath, "utf8");

  const oldVersion = envContent
    .match(/^VUE_APP_VERSION\s*=\s*.*/m)[0]
    .replace(/^VUE_APP_VERSION\s*=\s*/, "");
  const newVersion = semver.inc(oldVersion, "patch"); // 可以更改 'patch' 为 'minor' 或 'major'

  // 更新或追加 VUE_APP_VERSION 变量
  envContent = envContent.replace(
    /^VUE_APP_VERSION\s*=\s*.*/m,
    `VUE_APP_VERSION=${newVersion}`
  );

  // 写入文件
  fs.writeFileSync(envFilePath, envContent);
  console.log(`Version updated from ${oldVersion} to ${newVersion}`);
} catch (err) {
  console.error("Error reading .env file:", err);
}
