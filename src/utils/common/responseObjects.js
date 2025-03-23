export const internalServerError = (error) => {
  return {
    success: false,
    err: error,
    data: {},
    message: 'Internal server error'
  };
};

export const customErrorResponse = (error) => {
  if (!error.message && !error.explanation) {
    return internalServerError(error);
  }
  return {
    sucess: false,
    err: error.explanation,
    data: {},
    message: error.message
  };
};

export const sucessResponse = (data, message) => {
  return {
    success: true,
    message,
    data,
    err: {}
  };
};
