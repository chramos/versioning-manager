const fs = require("fs");

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

module.exports = FileManager;
