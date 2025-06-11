const Validator = require('./validator.js');

class PointValidator {
  static validateCoordinates(x, y) {
    if (!Validator.isNumber(x) || !Validator.isNumber(y)) {
      throw new TypeError(
        `Coordinates must be finite numbers. Got x=${x} (${typeof x}), y=${y} (${typeof y})`
      );
    }
  }
}

module.exports = PointValidator;
