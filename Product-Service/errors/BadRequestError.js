const {StatusCodes} = require('http-status-codes')
const CustomApiError = require('./custom-api')


class BadRequestError extends CustomApiError {
    constructor(message,error){
        super(message);
        this.error = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError