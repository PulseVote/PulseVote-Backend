const  ValidationError  = require("./ValidationError.js");

class PropertyError extends ValidationError {
  constructor(properties) {
    let message = "Invalid property values from json request\n";
    for (property of properties) {
      message += `property\n`;
    }

    super(message);
  }
}
module.exports = PropertyError;
