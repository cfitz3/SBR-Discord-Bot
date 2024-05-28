class SBRError extends Error {
    constructor(message, source) {
      super(message);
      this.name = "SBRError";
      this.source = source;
    }
  
    toString() {
      return this.message;
    }
  }
  
  module.exports = SBRError;