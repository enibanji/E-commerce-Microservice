const {StatusCodes} = require('http-status-codes')
const CustomApiError = require('./custom-api')


class UnauthenticatedError extends CustomApiError {
    constructor(message,error){
        super(message);
        this.error = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedError