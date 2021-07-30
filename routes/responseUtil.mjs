function getSuccessResponse(response) {
	return {
		...response,
		code: 0,
		msg: 'success'
	}
}

function getErrorResponse(errorMessage) {
	return {
		code: 1,
		msg: errorMessage || 'unknown error'
	}
}

export {
	getSuccessResponse,
	getErrorResponse
}
