import { RushConfiguration } from "@microsoft/rush-lib";
import { spawn } from "child_process";

function run() {
  const projects = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  });

  const server = projects.findProjectByShorthandName("@bit-cloud/api");
  const fe = projects.findProjectByShorthandName("@bit-cloud/fe");

  if (server && fe) {
    spawn("sh", ["-c", "rushx dev"], {
      cwd: server.projectFolder,
      shell: false,
      stdio: [0, 1, 2],
    });

    spawn("sh", ["-c", "rushx dev"], {
      cwd: fe.projectFolder,
      shell: false,
      stdio: [0, 1, 2],
    });
  }
}

run();
