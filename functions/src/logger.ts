export default class Logger {
  static debug(message, label) {
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
