import { RushConfiguration } from "@microsoft/rush-lib";
import { spawn } from "child_process";

function run() {
  const projects = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  });

  const server = projects.findProjectByShorthandName("@bit-cloud/api");
  const fe = projects.findProjectByShorthandName("@bit-cloud/fe");

  if (server && fe) {
    const command = process.platform === "win32" ? "cmd" : "sh";
    const args = process.platform === "win32" ? ["/c", "rushx dev"] : ["-c", "rushx dev"];

    spawn(command, args, {
      cwd: server.projectFolder,
      shell: false,
      stdio: [0, 1, 2],
    });

    spawn(command, args, {
      cwd: fe.projectFolder,
      shell: false,
      stdio: [0, 1, 2],
    });
  }
}

run();