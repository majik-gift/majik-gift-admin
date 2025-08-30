import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { Cancel } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import UIButton from "../button";

const UIDialog = ({
  isopen,
  onClose = null,
  dialogTitle = "",
  dialogMessage = "So you want to perform this action ?",
  dialogActionText = "Okay",
  isLoading = false,
  showCloseIcon = true,
  children,
  actions,
  ...otherProps
}) => {
  const closeIcon = showCloseIcon && (
    <Box display="flex" justifyContent="flex-end" sx={{ p: "0.5rem" }}>
      <IconButton color="error" onClick={onClose}>
        <Cancel />
      </IconButton>
    </Box>
  );

  if (children) {
    return (
      <Dialog
        open={isopen}
        onClose={onClose}
        // sx={{
        //   "& .MuiDialog-paper": { pb: "2.5rem" },
        // }}
        fullWidth
        {...otherProps}
      >
        <Box display="flex" alignItems="center" justifyContent={dialogTitle ? "space-between" : "flex-end"}>
          {dialogTitle && (
            <DialogTitle fontWeight={700} fontSize="1.5rem" id="responsive-dialog-title">
              {dialogTitle}
            </DialogTitle>
          )}

          {closeIcon}
        </Box>

        <DialogContent sx={{ paddingTop: "0.5rem" }}>{children}</DialogContent>

        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  }

  return (
    <Dialog sx={{ "& .MuiDialog-paper": { pb: "2.5rem" } }} open={isopen} onClose={onClose} fullWidth {...otherProps}>
      {closeIcon}
      <Box display="flex" alignItems="center" justifyContent="center">
        <DialogTitle fontWeight={700} fontSize="2rem" sx={{ paddingBottom: 0 }} id="responsive-dialog-title">
          {dialogTitle}
        </DialogTitle>
      </Box>
      <DialogContent sx={{ paddingTop: "0.5rem" }}>
        <DialogContentText textAlign="center">{dialogMessage}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "100%", maxWidth: "20rem", mx: "auto" }}>
        <Box display="flex" width="100%" justifyContent="center" gap="0.7rem">
          <UIButton rounded isLoading={isLoading} fullWidth variant="contained" onClick={() => onClose({ isConfirmed: true })}>
            {dialogActionText}
          </UIButton>
          <UIButton rounded variant="outlined" fullWidth onClick={onClose}>
            No
          </UIButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UIDialog;

UIDialog.propTypes = {
  isopen: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  dialogTitle: PropTypes.string,
  dialogMessage: PropTypes.string,
  dialogActionText: PropTypes.string,
  children: PropTypes.any,
  showCloseIcon: PropTypes.bool,
};
