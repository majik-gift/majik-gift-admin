'use client';
import { useEffect, useState } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-material-ui-carousel';
import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleEvent, manageEventStatus } from '@/store/light-worker/events/events.thunk';
import dayjs from 'dayjs';
import moment from 'moment';
import RejectionDialog from './rejection-dialog';

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
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
    try {
      const { payload } = await dispatch(
        manageEventStatus({ params: { id }, payload: { registrationStatus: 'approved' } })
      );
      if (payload) {
        addToast({
          message: payload.message,
          severity: 'success',
        });
        router.push('/light-worker/events');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const bottomActions = () => (
    <Stack spacing={1} direction="row">
      <UIButton
        isLoading={singleEventLoading}
        disabled={singleEventLoading || singleEvent?.registration_status !== 'pending'}
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
        <Typography variant="h6">Group Activities Images</Typography>
        <Carousel
          indicators={true}
          autoPlay={false}
          animation="slide"
          navButtonsAlwaysVisible
          NextIcon={<ArrowForwardIos />}
          PrevIcon={<ArrowBackIos />}
        // sx={{ width: "100%", maxHeight: 400 }}
        >
          {data?.image?.map((img, index) => (
            <Box key={index} display="flex" justifyContent="center" height={260}>
              <Image
                src={img}
                alt={`Service Image ${index + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: '100%' }}
              />
            </Box>
          ))}
        </Carousel>
      </Grid2>

      {/* Event Name */}
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
        <Typography variant="h6">Group Activities Date</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.start_time).toLocaleDateString() || 'N/A'} */}
          {dayjs(data?.event_date).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Start Time</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.start_time).toLocaleDateString() || 'N/A'} */}
          {dayjs.unix(data?.start_time).format('hh:mm a')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">End Time</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.end_time).toLocaleDateString() || 'N/A'} */}
          {moment.unix(data?.end_time).format('hh:mm a')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Fees</Typography>
        <Typography variant="body1">
          {data?.fee_option === 'extras_package' ? 'Exclusive Package' : 'Regular Package'},{' '}
          {data?.applied_fee}%
        </Typography>
      </Grid2>

      {/* <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Fee Option</Typography>
        <Typography variant="body1">{data?.fee_option || 'N/A'}</Typography>
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

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6">Categories</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data?.categories.map((category, index) => (
            <Chip key={`chip-1-${index}`} label={category?.name} color="success" size="small" />
          ))}
        </Box>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
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
          {data?.description || 'N/A'}
        </Typography>
      </Grid2>

      {/* Featured Image */}
      {data?.banner_image && (
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h6">Featured Image</Typography>
          <Image
            src={data?.banner_image}
            alt={`Featured Image`}
            width={100}
            height={100}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            priority
          />
        </Grid2>
      )}
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
