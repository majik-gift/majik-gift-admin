'use client';
import { useEffect, useState } from 'react';

import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { getSingleEvent } from '@/store/light-worker/events/events.thunk';
import dayjs from 'dayjs';
import RejectionDialog from './rejection-dialog';

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { singleEvent, singleEventLoading, error } = useSelector((state) => state.event);
  console.log('🚀 ~ EventDetailsPage ~ singleEvent:', singleEvent);
  const { user } = useSelector((state) => state.auth);
  let isAdmin = user?.role === 'admin';
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Assuming you have an API call to fetch this data using id
    dispatch(getSingleEvent({ params: { id } }));
  }, [id]);

  useEffect(() => {
    if (error) {
      addToast({
        message: error.message,
        severity: 'error',
      });
    }
  }, [error]);

  const handleUserStatus = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`events/manage-status/${id}`, {
        registrationStatus: 'approved',
      });

      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
      router.push('/admin/events');
    } catch (error) {
      addToast({
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const bottomActions = () => (
    <Stack spacing={1} direction="row">
      <UIButton
        isLoading={singleEventLoading || loading}
        disabled={singleEventLoading || loading || singleEvent?.registration_status !== 'pending'}
        onClick={handleUserStatus}
      >
        Approve
      </UIButton>
      <UIButton
        color="error"
        disabled={singleEventLoading || singleEvent?.registration_status !== 'pending'}
        onClick={() => setOpenRejectionsDialog(!openRejectionsDialog)}
      >
        Reject
      </UIButton>
    </Stack>
  );

  const renderUserDetails = (data) => (
    <Grid2 container spacing={2}>
      {/* Carousel for Images */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">Group Activities images</Typography>
        <Box display="flex" justifyContent="center" height={260}>
          <Image
            src={data?.banner_image}
            alt={`Group Activities Image`}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 'auto', height: '100%' }}
          />
        </Box>
      </Grid2>

      {/* Event Name */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Group Activities Name</Typography>
        <Typography variant="body1">{data?.title || '-'}</Typography>
      </Grid2>

      {/* Price */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Price</Typography>
        <Typography variant="body1">{data?.total_price || '-'} AUD</Typography>
      </Grid2>

      {/* Price */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Group Activities Date</Typography>
        <Typography variant="body1">
          {dayjs(data?.event_date).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Start Time</Typography>
        <Typography variant="body1">
          {dayjs.unix(data?.start_time).format('h:mm A') || '-'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">End Time</Typography>
        <Typography variant="body1">
          {dayjs.unix(data?.end_time).format('h:mm A') || '-'}
        </Typography>
      </Grid2>

      {/* <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Fee Option</Typography>
        <Typography variant="body1">{data?.fee_option || '-'}</Typography>
      </Grid2> */}

      {/* Registration Status */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Status</Typography>

        <Chip
          label={data?.registration_status}
          sx={{ textTransform: 'capitalize' }}
          color={
            data?.registration_status === 'approved'
              ? 'success'
              : data?.registration_status === 'rejected'
                ? 'error'
                : 'warning'
          }
          size="small"
        />
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">People Joined</Typography>
        <Typography variant="body1">{data?.joined_people}</Typography>
      </Grid2>

      {/* Description */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6">Description</Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word', // Words will break if too long
          }}
        >
          {data?.description || '-'}
        </Typography>
      </Grid2>
    </Grid2>
  );

  return (
    <>
      <UICard heading={'Group Activities Details'} backButton bottomActions={isAdmin ? bottomActions() : null}>
        <ApiLoader loading={singleEventLoading}>
          {singleEvent && renderUserDetails(singleEvent)}
        </ApiLoader>
      </UICard>
      <RejectionDialog
        open={openRejectionsDialog}
        id={id}
        handleDialogState={setOpenRejectionsDialog}
      />
    </>
  );
};

export default EventDetailsPage;
