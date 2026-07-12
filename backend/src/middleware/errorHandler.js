export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  const response = {
    success: false,
    message: err.message || 'An unexpected error occurred.',
  };

  // Log internal server errors (500)
  if (statusCode === 500) {
    console.error('System Error:', err);
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Ensure internal database details aren't leaked in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    response.message = 'A system error occurred. Please try again later.';
  }

  return res.status(statusCode).json(response);
};
