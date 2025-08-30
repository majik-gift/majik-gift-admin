import axiosInstance from './axiosInstance';

// Utility function for GET requests
export const apiGet = async (url, params = {}, config = {}) => {
  try {
    const response = await axiosInstance.get(url, { params, ...config });
    return response.data;
  } catch (error) {
    const handledError = handleError(error); // Get the error object
    return { error: handledError };
  }
};

// Utility function for POST requests
export const apiPost = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    const handledError = handleError(error); // Get the error object
    return { error: handledError };
  }
};

// Utility function for PUT requests
export const apiPut = async (url, data = {}, config = {}) => {
  console.log('🚀 ~ apiPut ~ data:', data);
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    const handledError = handleError(error); // Get the error object
    return { error: handledError };
  }
};

export const apiPatch = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  } catch (error) {
    const handledError = handleError(error); // Get the error object
    return { error: handledError };
  }
};

// Utility function for DELETE requests
export const apiDelete = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    // throw new Error(error)
    const handledError = handleError(error); // Get the error object
    return { error: handledError };
  }
};

// Centralized error handling function
const handleError = (err) => {
  let msg = 'An error occurred!';
  let code = err.statusCode || 'UNKNOWN_ERROR';
  let status = err.response?.status || 'UNKNOWN_STATUS';
  let data = err.details || null;
  console.log('🚀 ~ handleError ~ data:', data);

  if (err.code === 'ERR_NETWORK') {
    msg =
      'Sorry about that! Our app is having some difficulty connecting to the network right now.';
  } else if (err.response?.status === 401) {
    msg = 'Unauthorized: Please check your credentials.';
    data = err.response?.data?.error; // If you want specific error info here
  } else {
    msg = err.message || msg;
  }

  // Return the error object instead of throwing
  return {
    message: msg,
    code,
    status,
    data,
  };
};
