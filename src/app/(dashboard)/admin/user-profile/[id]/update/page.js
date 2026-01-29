'use client';

import { useEffect, useState } from 'react';
import { userProfileSchema } from './userProfileSchema';
import {
  ApiLoader,
  UIButton,
  UICard,
  UIDatePicker,
  UIFileUploader,
  UIInputField,
  UIPasswordField,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleLightWoker } from '@/store/light-worker/add-update/lightWoker.thunk';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid2, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import axiosInstance from '@/shared/services/axiosInstance';
import { setCurrentUser } from '@/store/auth/auth.slice';

const UpdateProfile = () => {
  const { id } = useParams();
  const { singleLightWorker, singleLightWorkerLoading, loading } = useSelector(
    (state) => state.lightWorkers
  );
  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const isUpdate = id;
  const { user } = useSelector((state) => state.auth);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    resolver: yupResolver(userProfileSchema(isUpdate)),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      profile_image: [],
      medium_type: '',
    },
  });
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      dispatch(getSingleLightWoker({ params: { id } }));
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (isUpdate && singleLightWorker) {
      Object.keys(singleLightWorker).forEach((key) => {
        if (!['insurance'].includes(key)) {
          let value = singleLightWorker[key];
          if (['insurance_expire_date'].includes(key)) {
            value = dayjs(value);
          }

          setValue(key, value);
        }
      });
    }
  }, [singleLightWorker, setValue, isUpdate]);

  const addLightWorkerHandler = async (dataToSend) => {
    setLoading(true);
    const payload = {
      first_name: dataToSend?.first_name, // User's first name
      last_name: dataToSend?.last_name, // User's last name
      email: dataToSend?.email,
      phone_number: dataToSend?.phone_number, // User's phone number
      medium_type: dataToSend?.medium_type, // User's medium type
    };

    if (typeof dataToSend?.profile_image !== 'string') {
      payload.profile_image = dataToSend?.profile_image;
    }

    try {
      const url = isUpdate ? `users` : 'users';
      const method = isUpdate ? 'put' : 'post';
      const res = await axiosInstance[method](url, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(
        setCurrentUser({
          ...user,
          profile_image: res?.data?.response?.details?.profile_image,
        })
      );
      addToast({ message: 'Profile updated successfully', severity: 'success' });
      router.push('/admin/dashboard');
    } catch (error) {
      if (error.status === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, fieldName) => {
    setValue(fieldName, e);
    clearErrors(fieldName);
  };

  return (
    <ApiLoader loading={singleLightWorkerLoading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(addLightWorkerHandler)}>
        <UICard backButton pageHeight heading={`${isUpdate ? 'Update' : 'Add'} Profile`}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }} key="first_name">
              <UIInputField
                name="first_name"
                label="First Name" // Added label here
                placeholder="First Name"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.first_name?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="last_name">
              <UIInputField
                name="last_name"
                label="Last Name" // Added label here
                placeholder="Last Name"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.last_name?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="email">
              <UIInputField
                name="email"
                label="Email" // Added label here
                placeholder="Email"
                type="text"
                fullWidth
                control={control}
                disabled
                errorMessage={errors.email?.message} // Fixed the error reference to match the field name
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="phone_number">
              <UIInputField
                name="phone_number"
                label="Phone Number" // Added label here
                placeholder="Phone Number"
                type="number"
                fullWidth
                control={control}
                errorMessage={errors.phone_number?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="medium_type">
              <UIInputField
                name="medium_type"
                label="Medium Type" // Added label here
                placeholder="Medium Type"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.medium_type?.message} // Fixed the error reference to match the field name
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 12 }} key="profile_image">
              <UIFileUploader
                label="Upload Profile Image" // Added label here
                title="Upload Image"
                aspectRatio={1}
                onChange={(e) => handleFileUpload(e, 'profile_image')}
                initialImages={
                  isUpdate && watch('profile_image') == singleLightWorker?.profile_image
                    ? singleLightWorker?.profile_image
                      ? [singleLightWorker?.profile_image]
                      : []
                    : []
                }
                errorMessage={errors.profile_image?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }} key="submit">
              <Stack alignItems="center">
                <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={loading}>
                  {isUpdate
                    ? isLoading
                      ? 'Updating...'
                      : 'Update'
                    : isLoading
                      ? 'Adding...'
                      : 'Add'}
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
