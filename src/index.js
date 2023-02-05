const yargs = require("yargs");
const chalk = require("chalk");
const GradleManager = require("./gradle-manager");
const PBXManager = require("./pbx-manager");

const usage = chalk.keyword("violet")(
  "\nUsage: vm increment-version -t <type>  -p <platform> \n"
);

const options = yargs
  .usage(usage)
  .option("t", {
    alias: "type",
    describe: "[major|minor|patch] semver release type",
    default: "patch",
    type: "string",
    demandOption: false,
  })
  .option("p", {
    alias: "platform",
    describe: "[android|ios|both] specifies the platform",
    default: "both",
    type: "string",
    demandOption: false,
  })
  .help(true).argv;

const { t, p } = options;

let output = chalk.keyword("blue")(
  `\n-------------------------------------------------------\n---- Successfully incremented the ${t} version 🎉 ----\n-------------------------------------------------------\n\n`
);

if (["both", "android"].some((platform) => p === platform)) {
  const gradleManager = new GradleManager();
  gradleManager.incrementVersion(t);
  gradleManager.incrementBuildNumber();
  output =
    output +
    chalk.keyword("green")(
      `Android: ${gradleManager.getCurrentVersion()}(${gradleManager.getCurrentBuildNumber()})\n`
    );
}

if (["both", "ios"].some((platform) => p === platform)) {
  const pbxManager = new PBXManager();
  pbxManager.incrementVersion(t);
  pbxManager.incrementBuildNumber();
  output =
    output +
    chalk.keyword("green")(
      `iOS: ${pbxManager.getCurrentVersion()}(${pbxManager.getCurrentBuildNumber()})\n`
    );
}

console.log(output);
