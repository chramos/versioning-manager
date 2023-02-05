const yargs = require("yargs");
const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");

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

class FileManager {
  constructor(path) {
    this.path = path;
  }
  read() {
    return fs.readFileSync(this.path, "utf-8");
  }
  write(data) {
    return fs.writeFileSync(this.path, data, "utf-8");
  }
}

class VersionManager {
  constructor(version) {
    this.version = String(version);
  }
  incrementMajor() {
    const [major] = this.version.split(".").map(Number);
    return [major + 1, 0, 0].join(".");
  }
  incrementMinor() {
    const [major, minor] = this.version.split(".").map(Number);
    return [major, minor + 1, 0].join(".");
  }
  incrementPatch() {
    const [major, minor, path] = this.version.split(".").map(Number);
    return [major, minor, (path ?? 0) + 1].join(".");
  }
}

class GradleManager extends FileManager {
  constructor() {
    super("android/app/build.gradle");
  }
  getCurrentVersion() {
    const content = this.read();
    const [_, version] = /versionName "(.*)"/.exec(content);
    return version;
  }
  getCurrentBuildNumber() {
    const content = this.read();
    const [_, buildNumber] = /versionCode (\d+)/.exec(content);
    return Number(buildNumber);
  }
  getNextVersion(type) {
    const versionManager = new VersionManager(this.getCurrentVersion());
    return {
      major: versionManager.incrementMajor(),
      minor: versionManager.incrementMinor(),
      patch: versionManager.incrementPatch(),
    }[type];
  }
  incrementVersion(type = "patch") {
    const content = this.read();
    const version = this.getNextVersion(type);
    this.write(
      content.replace(/versionName "(.*)"/, `versionName "${version}"`)
    );
  }
  incrementBuildNumber() {
    const content = this.read();
    const currentBuildNumber = this.getCurrentBuildNumber();
    this.write(
      content.replace(
        /versionCode (\d+)/,
        `versionCode ${currentBuildNumber + 1}`
      )
    );
  }
}

class PBXManager extends FileManager {
  constructor() {
    const [pbxFile] = glob.sync("ios/*.xcodeproj/project.pbxproj");
    super(pbxFile);
  }
  getCurrentVersion() {
    const content = this.read();
    const [_, version] = /MARKETING_VERSION = (.*);/.exec(content);
    return version;
  }
  getCurrentBuildNumber() {
    const content = this.read();
    const [_, buildNumber] = /CURRENT_PROJECT_VERSION = (\d+);/.exec(content);
    return Number(buildNumber);
  }
  getNextVersion(type) {
    const versionManager = new VersionManager(this.getCurrentVersion());
    return {
      major: versionManager.incrementMajor(),
      minor: versionManager.incrementMinor(),
      patch: versionManager.incrementPatch(),
    }[type];
  }
  incrementVersion(type = "patch") {
    const content = this.read();
    const version = this.getNextVersion(type);
    this.write(
      content.replace(
        /MARKETING_VERSION = (.*);/g,
        `MARKETING_VERSION = ${version};`
      )
    );
  }
  incrementBuildNumber() {
    const content = this.read();
    const currentBuilNumber = this.getCurrentBuildNumber();
    this.write(
      content.replace(
        /CURRENT_PROJECT_VERSION = (\d+);/g,
        `CURRENT_PROJECT_VERSION = ${currentBuilNumber + 1};`
      )
    );
  }
}

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
