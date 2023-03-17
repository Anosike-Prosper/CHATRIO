class CustomError extends Error {
    constructor(message) {
      super(message);
      this.custom = true;
    }
  }

  module.exports = CustomError