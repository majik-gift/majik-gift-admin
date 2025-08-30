import { forwardRef, Fragment } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Image from 'next/image';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import { Cancel, Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDialog({ open, handleClose, loading, handleAccept, handleReject }) {
  return (
    <Dialog
      open={open?.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ width: '100%' }}
    >
      <DialogTitle width={'300px'}>
        <Typography variant='h6'>{'Manage Payment Status'}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        color='error'
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Image src={open?.image} alt="no image" width={250} height={250} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {open?.row?.status === 'cancelled' ? (
          <Chip color="error" label="Rejected" />
        ) : open?.row?.status === 'pending' ? (
          <Stack direction={'row'}>
            <LoadingButton variant="text" color="success" loading={loading?.accept} onClick={() => handleAccept({ id: open?.id })}>
              Accept
            </LoadingButton>
            <LoadingButton variant="outlined" color="error" loading={loading?.reject} onClick={() => handleReject({ id: open?.id })}>
              Reject
            </LoadingButton>
          </Stack>
        ) : (
          open?.row?.status === 'inprogress' ||
          (open?.row?.status === 'completed' && <Chip color="success" label="Accepted" />)
        )}
      </DialogActions>
    </Dialog>
  );
}