'use client';

// import { logout } from '@/redux/slices/auth/auth.slice'; // Adjust this import to your setup
import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useToast } from '@/shared/context/ToastContext';
import { logout } from '@/store/auth/auth.slice';
// import { useToast } from './useToast'; // Custom toast hook

export function useApiRequest(
  apiAction,
  {
    initFetch = false, // Option to trigger fetch on mount
    initLoading = false, // Initial loading state
    customErrorHandling = false, // Allow custom error handling
    onSuccess = null, // Custom success handler
    onError = null, // Custom error handler
    onFinally = null, // Custom finally handler
    apiProps = null,
    successToats = false,
  } = {}
) {
  if (!apiAction) {
    throw new Error('API action must be provided in useApiDispatcher');
  }

  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [state, setState] = useState({
    loading: initLoading || initFetch,
    error: null,
    data: null,
  });

  // Determine if the passed action is a Redux Toolkit asyncThunk
  const isAsyncThunk = apiAction?.typePrefix !== undefined;

  // Internal helper to update state
  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Logout and notify the user if unauthorized
  const handleLogout = useCallback(
    (message = 'Session expired. Please log in again.') => {
      // notification.error({
      //     message: 'Authentication Error',
      //     subtitle: message,
      // });
      dispatch(logout());
    },
    [dispatch]
  );

  // Main function to trigger the API call
  const handleApiCall = useCallback(
    async (apiArgs) => {
      updateState('loading', true);
      updateState('error', null);

      try {
        let response;

        if (isAsyncThunk) {
          response = await dispatch(apiAction(apiArgs)).unwrap();
        } else {
          response = await apiAction(apiArgs);
        }

        if (response?.error) {
          const resError = new Error(response?.error.message);
          resError.code = response.error.code;
          resError.status = response.error.status;
          resError.data = response.error.data;
          throw resError;
        }

        updateState('data', response.response);
        updateState('rawData', response);

        if (onSuccess) onSuccess(response);

        if (successToats && response?.message)
          addToast({
            message: response.message,
            severity: 'success', // 'error', 'warning', 'info', 'success'
          });

        return isAsyncThunk ? response : response.response;
      } catch (error) {
        let errorMessage = 'An unexpected error occurred.';
        if (error?.message === 'un-authorized') {
          handleLogout('Unauthorized access.');
        } else {
          errorMessage = error?.data?.message || error.message || errorMessage;

          // Ensure we handle errors safely
          if (customErrorHandling && onError) {
            onError(error);
          } else {
            // If the error object is undefined or doesn't have a message, prevent accessing it directly
            if (error) {
              updateState('error', errorMessage);
              updateState('errorStack', error);
            } else {
              updateState('error', 'An unknown error occurred.');
            }
          }
        }

        if (error.code === 404) {
          addToast({
            message: 'Something went wrong please try again later',
            severity: 'error', // 'error', 'warning', 'info', 'success'
          });
        }

        if (error.code === 500) {
          addToast({
            message: 'Something went wrong please try again later',
            severity: 'error', // 'error', 'warning', 'info', 'success'
          });
        }

        if (error.code === 400) {
          addToast({
            message: error.message,
            severity: 'error', // 'error', 'warning', 'info', 'success'
          });
        }

        if (error.code === 'ERR_NETWORK') {
          addToast({
            message: error.message,
            severity: 'error', // 'error', 'warning', 'info', 'success'
          });
        }

        updateState('loading', false);
        return Promise.reject({ details: error, message: errorMessage });
      } finally {
        updateState('loading', false);
        if (onFinally) onFinally();
      }
    },
    [
      apiAction,
      dispatch,
      customErrorHandling,
      onSuccess,
      onError,
      onFinally,
      isAsyncThunk,
      handleLogout,
    ]
  );

  // Optionally trigger the API call on mount if `initFetch` is true
  useEffect(() => {
    if (initFetch) {
      handleApiCall(apiProps);
    }
  }, [initFetch, handleApiCall]);

  // Return the state and API call function
  return [
    handleApiCall, // Expose the API call handler to trigger manually
    state?.loading,
    state?.error,
    state?.data,
    state?.errorStack,
    updateState,
    state?.rawData,
  ];
}
