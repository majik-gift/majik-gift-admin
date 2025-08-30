'use client';
import { useEffect, useState } from 'react';

import { Avatar, Grid2, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { getSingleUser, mangeUserStatus } from '@/store/admin/users/users.thunks';
import dayjs from 'dayjs';

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const [statusLoading, setStatusLoading] = useState(null);

  const { userData } = useSelector((state) => state.users);
  const [fetchUser, loading] = useApiRequest(getSingleUser);

  const [mangeUserStatusCall] = useApiRequest(mangeUserStatus);

  useEffect(() => {
    fetchUser({ id: params.id });
  }, [params]);

  const handleUserStatus = async (status) => {
    setStatusLoading(status);
    try {
      const response = await mangeUserStatusCall({
        params: { id: params.id[0] },
        payload: { registrationStatus: status },
      });
      router.back();
    } catch (error) {
      console.log('🚀 ~ handleUserStatus ~ error:', error);
    } finally {
      setStatusLoading(null);
    }
  };

  const bottomActions = () => (
    <Stack spacing={1} direction="row">
      <UIButton
        isLoading={statusLoading === 'approved'}
        disabled={loading || userData?.registration_status !== 'pending' || statusLoading}
        onClick={() => {
          handleUserStatus('approved');
        }}
      >
        Approve
      </UIButton>
      <UIButton
        color="error"
        isLoading={statusLoading === 'rejected'}
        disabled={loading || userData?.registration_status !== 'pending' || statusLoading}
        onClick={() => {
          handleUserStatus('rejected');
        }}
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

      {/* Created At */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Register At</Typography>
        <Typography variant="body1">
          {/* {new Date(userData.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).replaceAll(" " ,'-') || '-'} */}
          {dayjs(userData.created_at).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>

      {/* Address */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Address</Typography>
        <Typography variant="body1">{userData.address || '-'}</Typography>
      </Grid2>

      {/* Phone Number */}
      {/* <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Phone Number</Typography>
        <Typography variant="body1">{userData.phone_number || '-'}</Typography>
      </Grid2> */}

      {/* Note */}
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1">{userData.note || '-'}</Typography>
      </Grid2>

      {/* Add more fields similarly */}
    </Grid2>
  );

  return (
    <UICard heading={'Customer Details'} backButton>
      <ApiLoader loading={loading}>{userData && renderUserDetails(userData)}</ApiLoader>
    </UICard>
  );
};

export default UserDetailsPage;
