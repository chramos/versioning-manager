const FileManager = require("./file-manager");
const VersionManager = require("./version-manager");

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

module.exports = GradleManager;
