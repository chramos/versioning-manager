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

module.exports = VersionManager;
