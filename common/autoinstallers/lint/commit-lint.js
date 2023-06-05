const path = require("path");
const fs = require("fs");
const child_process = require("child_process");

const gitPath = path.resolve(__dirname, "../../../.git");
const configPath = path.resolve(__dirname, "./commitlint.config.js");
const commitlintBinPath = path.resolve(__dirname, "./node_modules/.bin/commitlint");

if (!fs.existsSync(gitPath)) {
  console.error("no valid .git path");
  process.exit(1);
}

const result = child_process.spawnSync(
  "sh",
  ["-c", `${commitlintBinPath} --config ${configPath} --cwd ${path.dirname(gitPath)} --edit`],
  {
    stdio: "inherit",
  },
);

if (result.status !== 0) {
  process.exit(1);
}
