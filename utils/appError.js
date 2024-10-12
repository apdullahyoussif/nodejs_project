class AppError extends Error {
    constructor(parameters) {
        super();
    }
    create(message, statusCode, statusText) {
        this.message = message;
        this.statusCode = statusCode;
        this.statusText = statusText;
        return this;
    }
}

export default new AppError()