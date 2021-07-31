import { RequestParamsFormatValidationError } from '../errors.js';

function getSuccessResponse(response) {
	return {
		...response,
		code: 0,
		msg: 'success'
	}
}

function getErrorResponse(error) {
	let responseError = error;

	// check if error comes from openapi validation
	// todo: find better way to detect it
	if (responseError.name === 'Bad Request') {
		responseError = new RequestParamsFormatValidationError(error.message);
	}

	// If it's unexpected error which was not thrown by this application (e.g. db connection error)
	// we don't want to return error details to response - it may be not secure
	// so we just return general message and code
	const message = responseError.isAppError ? responseError.message : 'system error';
	const code = responseError.isAppError ? responseError.code : 1;

	return {
		code,
		msg: message
	}
}

export {
	getSuccessResponse,
	getErrorResponse
}
