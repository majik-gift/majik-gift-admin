'use client';

import { changePassword } from './changePassword';
import { ApiLoader, UIButton, UICard, UIPasswordField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid2, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import axiosInstance from '@/shared/services/axiosInstance';

const UpdateProfile = () => {
  const { id } = useParams();
  const { singleLightWorkerLoading, loading } = useSelector((state) => state.lightWorkers);
  const router = useRouter();
  const { addToast } = useToast();

  const {
    control,
    formState: { errors },

    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(changePassword()),
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const addLightWorkerHandler = async (dataToSend) => {
    const payload = {
      password: dataToSend?.password,
      new_password: dataToSend?.new_password,
    };

    try {
      const url = 'auth/change-password';
      const method = 'patch';
      const res = await axiosInstance[method](url, payload);
      addToast({ message: 'Password changed successfully', severity: 'success' });
      router.push('/admin/dashboard');
    } catch (error) {
      if (error.status === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
    }
  };

  return (
    <ApiLoader loading={singleLightWorkerLoading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(addLightWorkerHandler)}>
        <UICard backButton pageHeight heading="Change Password">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }} key="password">
              <UIPasswordField
                name="password"
                label="Old Password"
                errorMessage={errors.password?.message}
                control={control}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="new_password">
              <UIPasswordField
                name="new_password"
                label="New Password"
                errorMessage={errors.new_password?.message}
                control={control}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="confirm_password">
              <UIPasswordField
                name="confirm_password"
                label="Confirm Password"
                errorMessage={errors.confirm_password?.message}
                control={control}
                fullWidth
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }} key="submit">
              <Stack alignItems="center">
                <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={loading}>
                  Update
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
        </UICard>
      </Box>
    </ApiLoader>
  );
};

export default UpdateProfile;
