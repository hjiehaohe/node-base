class DefaultError extends Error {

    constructor(message, code = 500) {
        super(message);
        this.message = message;
        this.status = code;
    }
}
module.exports = DefaultError;