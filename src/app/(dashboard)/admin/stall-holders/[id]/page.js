'use client';
import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleUser, mangeUserStatus } from '@/store/admin/users/users.thunks';
import { Avatar, Button, Chip, Grid2, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RejectionDialog from './rejection-dialog';
import dayjs from 'dayjs';

const UserDetailsPage = () => {
  const { id } = useParams();

  const router = useRouter();
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.users);
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(getSingleUser({ id }));
  }, [id]);

  useEffect(() => {
    if (error) {
      addToast({
        message: error.message,
        severity: 'error',
      }); // Show toast if there's an error
    }
  }, [error]);

  const handleUserStatus = async () => {
    try {
      setIsLoading(true);
      const payload = await dispatch(
        mangeUserStatus({ params: { id }, payload: { registrationStatus: 'approved' } })
      ).unwrap();
      addToast({
        message: payload.message,
        severity: 'success',
      });
      router.push('/admin/stall-holders');
    } catch (error) {
      console.log('🚀 ~ handleUserStatus ~ error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const bottomActions = () => (
    <Stack spacing={1} direction="row">
      <UIButton
        isLoading={isLoading}
        disabled={loading || userData?.registration_status !== 'pending'}
        onClick={handleUserStatus}
      >
        Approve
      </UIButton>
      <UIButton
        color="error"
        disabled={loading || userData?.registration_status !== 'pending'}
        onClick={() => setOpenRejectionsDialog(!openRejectionsDialog)}
      >
        Reject
      </UIButton>
    </Stack>
  );

  const renderUserDetails = (userData) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Avatar
          alt={`${userData.first_name} ${userData.last_name}`}
          src={userData.profile_image}
          sx={{ width: 120, height: 120 }}
        />
      </Grid2>

      {/* First Name */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">First Name</Typography>
        <Typography variant="body1">{userData.first_name || '-'}</Typography>
      </Grid2>

      {/* Last Name */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Last Name</Typography>
        <Typography variant="body1">{userData.last_name || '-'}</Typography>
      </Grid2>

      {/* Email */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Email</Typography>
        <Typography variant="body1">{userData.email || '-'}</Typography>
      </Grid2>

      {/* Phone Number */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Phone Number</Typography>
        <Typography variant="body1">{userData.phone_number || '-'}</Typography>
      </Grid2>

      {/* Status */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Status</Typography>
        <Typography variant="body1">{userData.status || '-'}</Typography>
      </Grid2>

      {/* Registration Status */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Registration Status</Typography>
        <Chip
          label={userData.registration_status || '-'}
          color={
            userData.registration_status === 'approved'
              ? 'success'
              : userData.registration_status === 'rejected'
                ? 'error'
                : 'warning'
          }
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </Grid2>

      {/* Insurance Paper */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Insurance Paper</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          LinkComponent={Link}
          href={userData?.insurance}
          target="_blank"
        >
          View Paper
        </Button>
      </Grid2>

      {/* Insurance Expiry */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Insurance Expiry</Typography>
        <Typography variant="body1">
          {/* {new Date(userData.insurance_expire_date)
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .replaceAll(' ', '-') || '-'} */}
          {dayjs(userData.insurance_expire_date).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>

      {/* Created At */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Registered At</Typography>
        <Typography variant="body1">
          {dayjs(userData.created_at).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
        </Typography>
      </Grid2>

      {/* Abn */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Abn</Typography>
        <Typography variant="body1">{userData.abn}</Typography>
      </Grid2>

      {/* Area of work */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Area of work</Typography>
        <Typography variant="body1">{userData.area_of_work}</Typography>
      </Grid2>

      {/* Website */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Website</Typography>
        <Typography variant="body1">
          {userData.website ? (
            <Link target="_blank" href={userData.website}>
              {userData.website}
            </Link>
          ) : (
            '-'
          )}
        </Typography>
      </Grid2>

      {/* Address */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Address</Typography>
        <Typography variant="body1">{userData.address || '-'}</Typography>
      </Grid2>

      {/* Business Name */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Business Name</Typography>
        <Typography variant="body1">{userData.business_name || '-'}</Typography>
      </Grid2>

      {/* Residential Country */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Country</Typography>
        <Typography variant="body1">{userData.country || '-'}</Typography>
      </Grid2>

      {/* Social Media*/}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Facebook</Typography>
        <Typography variant="body1">
          {userData.facebook ? (
            <Link target="_blank" href={userData.facebook}>
              {userData.facebook}
            </Link>
          ) : (
            '-'
          )}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Instagram</Typography>
        <Typography variant="body1">
          {userData.instagram ? (
            <Link target="_blank" href={userData.instagram}>
              {userData.instagram}
            </Link>
          ) : (
            '-'
          )}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Tiktok</Typography>
        <Typography variant="body1">
          {userData.tiktok ? (
            <Link target="_blank" href={userData.tiktok}>
              {userData.tiktok}
            </Link>
          ) : (
            '-'
          )}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Other Social Media</Typography>
        <Typography variant="body1">
          {userData.other_social_media ? (
            <Link target="_blank" href={userData.other_social_media}>
              {userData.other_social_media}
            </Link>
          ) : (
            '-'
          )}
        </Typography>
      </Grid2>

      {/* Note */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1">{userData.note || '-'}</Typography>
      </Grid2>

      {/* Add more fields similarly */}
    </Grid2>
  );

  return (
    <>
      <UICard
        heading={'User Details'}
        backButton
        bottomActions={userData?.registration_status === 'pending' && bottomActions()}
      >
        <ApiLoader loading={loading}>{userData && renderUserDetails(userData)}</ApiLoader>
      </UICard>
      <RejectionDialog
        open={openRejectionsDialog}
        id={id}
        handleDialogState={setOpenRejectionsDialog}
      />
    </>
  );
};

export default UserDetailsPage;
