//This file used to make custom error object
class ErrorHandler extends Error {
    constructor(statusCode = 500, message = "Something Went Wrong", errors = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.success = false;
    }
}

export default ErrorHandler;
