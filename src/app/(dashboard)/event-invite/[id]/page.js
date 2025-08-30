'use client';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { useUI } from '@/shared/context/UIContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RejectionDialog from './rejection-dialog';
import moment from "moment"

const EventDetailsPage = () => {
  const [eventsInvite, setEventsInvite] = useState({});
  const [loading, setLoading] = useState(false);
  const { toggleLoader } = useUI();
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  let isAdmin = user?.role === 'admin';
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const { addToast } = useToast();

  const fetchEventsInvite = async () => {
    // setLoading(true);
    toggleLoader('showLoader');
    try {
      const url = `events/find-invite/${id}`;
      const method = 'get';
      const res = await axiosInstance[method](url);
      setEventsInvite(res?.data?.response?.details);
    } catch (error) {
      console.log(error);
      router.push('/');
    } finally {
      toggleLoader('showLoader');
    }
  };

  const handleUserStatus = async (status) => {
    setLoading(true);
    try {
      const url = `events/respond-to-invitation`;
      const method = 'post';
      const payload = { status, event_id: +id };
      const res = await axiosInstance[method](url, payload);
      fetchEventsInvite();
      addToast({
        message: res.data.message,
        severity: 'success',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsInvite();
  }, []);
  console.log('🚀 ~ EventDetailsPage ~ eventsInvite:', eventsInvite);

  const bottomActions = () => {
    return (
      <Stack spacing={1} direction="row">
        <>
          <UIButton
            isLoading={loading}
            // disabled={loading || eventsInvite?.registration_status !== 'pending'}
            onClick={() => handleUserStatus('accepted')}
          >
            Approve
          </UIButton>
          <UIButton
            color="error"
            // disabled={loading || eventsInvite?.registration_status !== 'pending'}
            // onClick={() => setOpenRejectionsDialog(!openRejectionsDialog)}
            onClick={() => handleUserStatus('rejected')}
          >
            Reject
          </UIButton>
        </>
      </Stack>
    );
  };

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

      {/* Group Activities Name */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Group Activities Name</Typography>
        <Typography variant="body1">{data?.title || 'N/A'}</Typography>
      </Grid2>

      {/* Price */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Price</Typography>
        <Typography variant="body1">{data?.total_price || 'N/A'} AUD</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Start Time</Typography>
        <Typography variant="body1">
          {data?.start_time ? moment.unix(data.start_time)?.format("hh:mm:ss a") : 'N/A'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">End Time</Typography>
        <Typography variant="body1">
          {data?.end_time ? moment.unix(data.end_time)?.format("hh:mm:ss a") : 'N/A'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Fees</Typography>
        <Typography variant="body1">
          {data?.fee_option === 'extras_package' ? 'Exclusive Package' : 'Regular Package'},{' '}
          {data?.applied_fee}%
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Categories</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data?.categories?.map((category, index) => (
            <Chip key={`chip-1-${index}`} label={category?.name} color="primary" size="small" />
          ))}
        </Box>
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
          {data?.description || 'N/A'}
        </Typography>
      </Grid2>
    </Grid2>
  );

  return (
    <>
      <UICard
        heading={'Group Activities Invitations'}
        bottomActions={eventsInvite?.status === 'pending' && bottomActions()}
      >
        <ApiLoader loading={loading}>
          {/* <ApiLoader loading={singleEventLoading}> */}
          {eventsInvite?.event && renderUserDetails(eventsInvite.event)}
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
