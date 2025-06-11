class Validator {
  static isNumber(value) {
    return +value === value;
  }
}

module.exports = Validator;
