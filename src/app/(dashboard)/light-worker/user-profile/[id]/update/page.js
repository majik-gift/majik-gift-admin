'use client';

import { useEffect, useState } from 'react';
import { lightWorkerAddSchema } from '@/app/(dashboard)/admin/light-workers/create/add-light-worker-schema';
import {
  ApiLoader,
  UIButton,
  UICard,
  UIDatePicker,
  UIDateTimePicker,
  UIFileUploader,
  UIInputField,
  UIPasswordField,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleLightWoker } from '@/store/light-worker/add-update/lightWoker.thunk';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Grid2, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import axiosInstance from '@/shared/services/axiosInstance';
import { userProfileSchema } from './userProfileSchema';
import { setCurrentUser } from '@/store/auth/auth.slice';

const UpdateProfile = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isPaypal = searchParams.get('tab');
  const { singleLightWorker, singleLightWorkerLoading, loading } = useSelector(
    (state) => state.lightWorkers
  );
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const isUpdate = id;
  const [isLoading, setLoading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(userProfileSchema(isUpdate)),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      note: '',
      paypal_connect: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      other_social_media: '',
      medium_type: '',
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getSingleLightWoker({ params: { id } }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isUpdate && singleLightWorker) {
      Object.keys(singleLightWorker).forEach((key) => {
        let value = singleLightWorker[key];

        if (['insurance_expire_date'].includes(key)) {
          value = dayjs(value);
        }

        setValue(key, value);
      });
    }
  }, [singleLightWorker, setValue, isUpdate]);

  const addLightWorkerHandler = async (dataToSend) => {
    setLoading(true);
    const payload = {
      first_name: dataToSend?.first_name, // User's first name
      last_name: dataToSend?.last_name, // User's last name
      email: dataToSend?.email, // User's email
      phone_number: dataToSend?.phone_number, // User's phone number
      address: dataToSend?.address, // User's address
      note: dataToSend?.note,
      ...(dataToSend?.country?.label === 'Australia'
        ? { insurance_expire_date: dataToSend.insurance_expire_date }
        : {}),
      // Social media URLs (optional)
      website: dataToSend?.website || '', // Website URL
      facebook: dataToSend?.facebook || '', // Facebook URL
      instagram: dataToSend?.instagram || '', // Instagram URL
      tiktok: dataToSend?.tiktok || '', // TikTok URL
      medium_type: dataToSend?.medium_type || '', // Medium type
      other_social_media: dataToSend?.other_social_media || '', // Other social media (optional)
    };
    if (typeof dataToSend.insurance !== 'string' && dataToSend?.country?.label === 'Australia') {
      payload.insurance = dataToSend.insurance;
    }
    if (typeof dataToSend?.profile_image !== 'string') {
      payload.profile_image = dataToSend?.profile_image;
    }

    try {
      const url = isUpdate ? `users` : 'users';
      const method = isUpdate ? 'put' : 'post';
      const res = await axiosInstance[method](url, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res?.data?.response?.details?.profile_image);
      dispatch(
        setCurrentUser({
          ...user,
          profile_image: res?.data?.response?.details?.profile_image,
        })
      );
      addToast({ message: 'Profile updated successfully', severity: 'success' });
      router.push('/light-worker/dashboard');
    } catch (error) {
      console.log('checking', error?.code);
      if (error.code === 422 && error?.data) {
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
        <UICard
          paypalError={isPaypal}
          backButton
          pageHeight
          heading={`${isUpdate ? 'Update' : 'Add'} Profile`}
        >
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

            <Grid2 size={{ xs: 12, md: 6 }} key="phone_number">
              <UIInputField
                name="phone_number"
                label="Phone Number" // Added label here
                placeholder="Phone Number"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.phone_number?.message}
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

            <Grid2 size={{ xs: 12, md: 6 }} key="address">
              <UIInputField
                name="address"
                label="Address" // Added label here
                placeholder="Address"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.address?.message}
              />
            </Grid2>
            {singleLightWorker?.country !== 'Australia' && (
              <Grid2 size={{ xs: 12, md: 6 }} key="paypal_connect">
                <UIInputField
                  name="paypal_connect"
                  label="Paypal Connect" // Added label here
                  placeholder="Paypal Connect"
                  type="text"
                  fullWidth
                  control={control}
                  errorMessage={errors.paypal_connect?.message}
                />
              </Grid2>
            )}
            {singleLightWorker?.country === 'Australia' && (
              <Grid2 size={{ xs: 12, md: 6 }} key="insurance_expire_date">
                <UIDateTimePicker
                  name="insurance_expire_date"
                  label="Insurance Expiry" // Added label here
                  placeholder="Insurance Expiry"
                  minDate={dayjs()}
                  fullWidth
                  control={control}
                  errorMessage={errors.insurance_expire_date?.message}
                />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12, md: 6 }} key="note">
              <UIInputField
                name="note"
                label="Description" // Added label here
                placeholder="Description"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.note?.message}
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
                errorMessage={errors.medium_type?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="website">
              <UIInputField
                name="website"
                label="Website" // Added label here
                placeholder="Website"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.website?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="facebook">
              <UIInputField
                name="facebook"
                label="Facebook" // Added label here
                placeholder="Facebook"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.facebook?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="instagram">
              <UIInputField
                name="instagram"
                label="Instagram" // Added label here
                placeholder="Instagram"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.instagram?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="tiktok">
              <UIInputField
                name="tiktok"
                label="Tiktok" // Added label here
                placeholder="Tiktok"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.tiktok?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="other_social_media">
              <UIInputField
                name="other_social_media"
                label="Other Social Media" // Added label here
                placeholder="Other Social Media"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.other_social_media?.message}
              />
            </Grid2>
            {singleLightWorker?.country === 'Australia' && (
              <Grid2 size={{ xs: 12, md: 6 }} key="insurance">
                <UIFileUploader
                  label="Upload Insurance" // Added label here
                  onChange={(e) => handleFileUpload(e, 'insurance')}
                  title="Upload Image"
                  initialImages={
                    isUpdate && watch('insurance') == singleLightWorker?.insurance
                      ? singleLightWorker?.insurance
                        ? [singleLightWorker?.insurance]
                        : []
                      : []
                  }
                  errorMessage={errors.insurance?.message}
                />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12, md: 12 }} key="profile_image">
              <UIFileUploader
                label="Upload Profile Image" // Added label here
                title="Upload Image"
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
