const FileManager = require("./file-manager");
const VersionManager = require("./version-manager");
const glob = require("glob");

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
module.exports = PBXManager;
