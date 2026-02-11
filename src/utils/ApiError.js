class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    data = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.stack = stack;
  }
};

export { ApiError };