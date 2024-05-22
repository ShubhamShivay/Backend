export const globalErrorHandler = (err, req, res, next) => {
	// Stack
	// Message
	const stack = err?.stack;
	const message = err?.message;
	const statusCode = err?.statusCode ? err?.statusCode : 500;

	return res.status(statusCode).json({
		stack,
		message,
	});
};

// 404 Not Found
export const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
};
