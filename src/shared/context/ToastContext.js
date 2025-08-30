import { createContext, useContext, useRef, useState } from "react";

import { Alert, Snackbar } from "@mui/material";

import { UIDialog } from "../components";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [dailogState, setDailogState] = useState({});
  const resolveCallBackRef = useRef(null);


  const [open, setOpen] = useState(false);

  const addToast = (toast) => {
    setToasts(toast);
    setOpen(true);
  };

  const handleToastClose = (event, reason) => {
    setOpen(false);
    setToasts(null);
  };

  const showDialog = ({
    title = 'Are you Sure?',
    message = 'This is a Message',
    actionText = 'Okay',
    showLoadingOnConfirm,
  } = {}) => {
    const updatedDialogState = {
      ...dailogState,
      isOpen: true,
      title,
      message,
      actionText,
      showLoadingOnConfirm,
    };

    setDailogState(updatedDialogState);

    return new Promise((res) => {
      resolveCallBackRef.current = res;
    });
  };

  const closeDialog = ({ isConfirmed = false } = {}) => {
    const updatedLoadingState = {
      ...dailogState,
      isLoading: true,
    };

    setDailogState(updatedLoadingState);

    const completeClose = () => {
      const updatedLoadingState = {
        ...dailogState,
        isOpen: false,
        isLoading: false,
        showLoadingOnConfirm: false,
      };
      setDailogState(updatedLoadingState);
      if (isConfirmed) resolveCallBackRef?.current();
      resolveCallBackRef.current = null;
    };

    if (isConfirmed && updatedLoadingState.showLoadingOnConfirm) {
      resolveCallBackRef.current(completeClose);
    } else completeClose();
  };

  return (
    <ToastContext.Provider value={{ addToast ,closeDialog,showDialog}}>
      {children}
      {toasts && <ToastContainer open={open} currentToast={toasts} onClose={handleToastClose} />}
      <UIDialog
        onClose={closeDialog}
        open={dailogState.isOpen}
        dialogActionText={dailogState.actionText}
        dialogTitle={dailogState.title}
        dialogMessage={dailogState.message}
        isLoading={dailogState.isLoading}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastContainer = ({ open, currentToast, onClose, onExited }) => {
  return (
    <Snackbar open={open} autoHideDuration={2500} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert onClose={onClose} variant="filled" severity={currentToast?.severity || "info"} sx={{ color: "white" }}>
        {currentToast?.message}
      </Alert>
    </Snackbar>
  );
};
