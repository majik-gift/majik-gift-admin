'use client';

import { useEffect } from 'react';

import { lightWorkerAddSchema } from '@/app/(dashboard)/admin/light-workers/create/add-light-worker-schema';
import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIAutocomplete,
  UIButton,
  UICard,
  UIDatePicker,
  UIFileUploader,
  UIInputField,
  UIPasswordField,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import {
  addStallHolder,
  getSingleStallHolder,
  updateStallHolder,
} from '@/store/stall-holder/add-update/stallHolder.thunk';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid2, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';

const StallHolder = ({ id }) => {
  const { singleStallHolder, singleStallHolderLoading, loading } = useSelector(
    (state) => state.stallHolders
  );
  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });
  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const isUpdate = id;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(lightWorkerAddSchema(isUpdate)),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone_number: '',
      address: '',
      note: '',
      business_name: '',
      insurance_expire_date: null,
      facebook: '',
      instagram: '',
      tiktok: '',
      other_social_media: '',
      banner_image: null,
    },
  });
  useEffect(() => {
    console.log('🚀 ~ StallHolder ~ errors:', errors);
  }, [errors]);
  useEffect(() => {
    if (id) {
      dispatch(getSingleStallHolder({ params: { id } }));
    }
  }, [id, dispatch]);
  const getCountries = async () => {
    try {
      let { data } = await axiosInstance.get(`country/countries?&search=${watch('country') || ''}`);
      let { id, name: label } = data?.response?.details[0] || {};
      if (id && label) {
        setValue('country', { id, label });
      }
    } catch (error) {
      console.log('🚀 ~ getCountries ~ error:', error);
    }
  };
  useEffect(() => {
    if (isUpdate && singleStallHolder) {
      Object.entries(singleStallHolder)?.map(([key, value]) => {
        if (!['insurance'].includes(key)) {
          if (['insurance_expire_date'].includes(key)) {
            value = dayjs(value);
          }

          setValue(key, value);
        }
      });
    }
    getCountries();
  }, [singleStallHolder, setValue, isUpdate]);

  const addStallHolderHandler = async (dataToSend) => {
    const payload = {
      first_name: dataToSend.first_name, // User's first name
      last_name: dataToSend.last_name, // User's last name
      email: dataToSend.email, // User's email
      // password: dataToSend.password, // User's password
      phone_number: dataToSend.phone_number, // User's phone number
      address: dataToSend.address, // User's address
      note: dataToSend.note,
      role: 'stall_holder',
      area_of_work: dataToSend.area_of_work,
      country: dataToSend.country.label,
      business_name: dataToSend.business_name, // Business name (optional)
      ...(dataToSend.country.label === 'Australia' ? { abn: dataToSend.abn } : {}), // Note (optional)
      ...(dataToSend.country.label === 'Australia'
        ? { insurance_expire_date: dataToSend.insurance_expire_date }
        : {}), // Note (optional)
      // Social media URLs (optional)
      facebook: dataToSend.facebook || null, // Facebook URL
      instagram: dataToSend.instagram || null, // Instagram URL
      tiktok: dataToSend.tiktok || null, // TikTok URL
      other_social_media: dataToSend.other_social_media, // Other social media (optional)
      ...((!dataToSend.password === '' || dataToSend.password) && {
        password: dataToSend.password,
      }),
    };
    if (dataToSend?.country?.label !== 'Australia') {
      payload.paypal_connect = dataToSend.paypal_connect;
    }
    if (typeof dataToSend.insurance !== 'string' && dataToSend.country.label === 'Australia') {
      payload.insurance = dataToSend.insurance;
    }
    if (typeof dataToSend.profile_image !== 'string') {
      payload.profile_image = dataToSend.profile_image;
    }

    let res;
    console.log(payload);

    try {
      if (isUpdate) {
        res = await dispatch(updateStallHolder({ params: { id }, payload })).unwrap();
      } else {
        res = await dispatch(addStallHolder(payload)).unwrap();
      }
      addToast({ message: 'Stall holder added successfully', severity: 'success' });
      router.push('/admin/stall-holders');
    } catch (error) {
      console.log('checking', error?.code);
      if (error.code === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
    }
  };

  const handleFileUpload = (e, fieldName) => {
    setValue(fieldName, e);
    clearErrors(fieldName);
  };
  //   const handleFileDelete = (imageIndex)=>{
  //     if(!isUpdate){
  //       return true
  //     }
  //     return dispatch(deleteEventImage({ params: { id, imageIndex } }))
  //     .unwrap()
  //     .then((res)=>{
  //       addToast({message:res?.message,severity:'success'});
  //       return true
  //     })
  //     .catch((error)=>{
  //       setError('image',{type:'manual',message:error?.data?.image})
  //       return false
  //     })
  //   }
  //   const getAllCategories = () => dispatch(categoriesGet());

  // //   if (type !== 'create' && type !== 'update') {
  // //     return <div>Invalid action</div>;
  // //   }

  //   let optForAutoComplete = allCategory
  //     ?.filter(
  //       (e) =>
  //         e.type === 'event_category' && !categoriesData.some((category) => category.value === e.id)
  //     )
  //     .map((e) => ({
  //       label: e.name,
  //       value: e.id,
  //     }));

  return (
    <ApiLoader loading={singleStallHolderLoading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(addStallHolderHandler)}>
        <UICard backButton pageHeight heading={`${isUpdate ? 'Update' : 'Add'} Stall Holder`}>
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
                errorMessage={errors.email?.message} // Fixed the error reference to match the field name
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="password">
              <UIPasswordField
                name="password"
                label="Password" // Added label here
                errorMessage={errors.password?.message}
                control={control}
                fullWidth
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

            <Grid2 size={{ xs: 12, md: 6 }} key="business_name">
              <UIInputField
                name="business_name"
                label="Business Name" // Added label here
                placeholder="Business Name"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.business_name?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} key="area_of_work">
              <UIInputField
                name="area_of_work"
                label="Area Of Work" // Added label here
                placeholder="Area Of Work"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.area_of_work?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} key="country">
              <UIAutocomplete
                name="country"
                label="Country" // Added label here
                placeholder="Country"
                type="text"
                multiple={false}
                fullWidth
                control={control}
                url={'country/countries?'}
                errorMessage={errors.country?.message}
              />
            </Grid2>
            {watch('country')?.label === 'Australia' && (
              <>
                <Grid2 size={{ xs: 12, md: 6 }} key="insurance_expire_date">
                  <UIDatePicker
                    name="insurance_expire_date"
                    label="Insurance Expiry" // Added label here
                    placeholder="Insurance Expiry"
                    minDate={dayjs()}
                    fullWidth
                    control={control}
                    errorMessage={errors.insurance_expire_date?.message}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }} key="abn">
                  <UIInputField
                    name="abn"
                    label="Abn" // Added label here
                    placeholder="Abn"
                    type="text"
                    fullWidth
                    control={control}
                    errorMessage={errors.abn?.message}
                  />
                </Grid2>
              </>
            )}
            {watch('country')?.label !== 'Australia' && (
              <Grid2 size={{ xs: 12, md: 6 }} key="phone_number">
                <UIInputField
                  name="paypal_connect"
                  label="Paypal Handle" // Added label here
                  placeholder="Paypal Handle"
                  type="text"
                  fullWidth
                  control={control}
                  errorMessage={errors.paypal_connect?.message}
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
            <Grid2 size={{ xs: 12, md: 6 }} key="website">
              <UIInputField
                name="website"
                label="Website" // Added label here
                placeholder="Website"
                type="url"
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
                type="url"
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
                type="url"
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
                type="url"
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
                type="url"
                fullWidth
                control={control}
                errorMessage={errors.other_social_media?.message}
              />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 6 }}></Grid2> */}
            {watch('country')?.label === 'Australia' && (
              <Grid2 size={{ xs: 12, md: 6 }} key="insurance">
                <UIFileUploader
                  label="Upload Insurance" // Added label here
                  onChange={(e) => handleFileUpload(e, 'insurance')}
                  title="Upload Image"
                  initialImages={
                    isUpdate && singleStallHolder?.users?.insurance
                      ? [singleStallHolder?.users?.insurance]
                      : []
                  }
                  errorMessage={errors.insurance?.message}
                />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12, md: 6 }} key="profile_image">
              <UIFileUploader
                label="Upload Profile Image" // Added label here
                title="Upload Image"
                onChange={(e) => handleFileUpload(e, 'profile_image')}
                initialImages={
                  isUpdate && singleStallHolder?.users?.profile_image
                    ? [singleStallHolder?.users?.profile_image]
                    : []
                }
                errorMessage={errors.profile_image?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }} key="submit">
              <Stack alignItems="center">
                <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={loading}>
                  {isUpdate ? 'Update' : 'Add'}
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
        </UICard>
      </Box>
    </ApiLoader>
  );
};

export default StallHolder;
