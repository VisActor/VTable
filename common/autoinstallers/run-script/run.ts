import minimist, { ParsedArgs } from "minimist";
import { RushConfiguration } from "@microsoft/rush-lib";
import { spawnSync } from "child_process";

interface RunScriptArgv extends ParsedArgs {
  project?: string;
  script?: string;
}

function run() {
  const argv: RunScriptArgv = minimist(process.argv.slice(2));
  const projects = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  });

  const targetProject = projects.findProjectByShorthandName(argv.project!);

  if (targetProject) {
    const command = process.platform === "win32" ? "cmd" : "sh";
    const args = process.platform === "win32" ? ["/c", `rushx ${argv.script}`] : ["-c", `rushx ${argv.script}`];

    spawnSync(command, args, {
      cwd: targetProject?.projectFolder,
      shell: false,
      stdio: [0, 1, 2],
    });
  }
}

run();