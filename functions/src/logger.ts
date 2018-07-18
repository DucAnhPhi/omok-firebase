export class Logger {
  static debug(label, message) {
    console.log("[DEBUG]", message, "(via " + label + ")");
  }

  static info(label, message) {
    console.log("[INFO]", message, "(via " + label + ")");
  }

  static warn(label, message) {
    console.log("[WARN]", message, "(via " + label + ")");
  }

  static error(label, message) {
    console.log("[ERROR]", message, "(via " + label + ")");
  }
}
