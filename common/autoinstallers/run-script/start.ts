import { RushConfiguration } from "@microsoft/rush-lib";
import { spawn,exec } from "child_process";

function run() {
  const projects = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  });

  const server = projects.findProjectByShorthandName("@bit-cloud/api");
  const fe = projects.findProjectByShorthandName("@bit-cloud/fe");

  if (server && fe) {
    exec("rushx dev",  {
      cwd: server.projectFolder,
    },);

    exec("rushx dev", {
      cwd: fe.projectFolder,
    });
  }
}

run();
