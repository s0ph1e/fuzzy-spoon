class AppError extends Error {
	constructor (message, code, status) {
		super(message);

		this.name = this.constructor.name;
		this.isAppError = true;

		this.code = code || 1;
		this.status = status || 500;

	}
}

class RequestParamsFormatValidationError extends AppError {
	constructor(message) {
		super(message, 2, 400);
	}
}

class InvalidStartDateError extends AppError {
	constructor(message) {
		super(message, 3, 400);
	}
}

class InvalidMinCountError extends AppError {
	constructor(message) {
		super(message, 4, 400);
	}
}


export {
	RequestParamsFormatValidationError,
	InvalidStartDateError,
	InvalidMinCountError
}
