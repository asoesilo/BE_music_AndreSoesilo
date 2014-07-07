function AppError(message) {
  this.name = "AppError";
  this.message = (message || "");
}

AppError.prototype = Error.prototype;

module.exports = AppError;