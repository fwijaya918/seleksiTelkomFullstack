const handleError = function (error, navigate) {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  } else if (error.request) {
    navigate("/server-error");
  } else {
    return {
      message: error.message,
    };
  }
};

export default handleError;
