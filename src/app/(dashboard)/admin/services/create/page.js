'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid2, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import {
  UIAutocomplete,
  UIButton,
  UICard,
  UIFileUploader,
  UIInputField,
  UIRadio,
  UISelect,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { categoriesGet } from '@/store/admin/categories/categories.thunk';
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import { createService } from '@/store/light-worker/services/services.thunk';
import { useEffect, useState } from 'react';
import { servicesSchema } from './schema';

const Create = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [isUserFecthingloading, setIsUserFecthingloading] = useState(false);

  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { loading } = useSelector((state) => state.services);

  // const [createServiceApi, loading, error, data] = useApiRequest(createService, {
  //   initFetch: false,
  // });
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(servicesSchema),
    defaultValues: {
      title: '',
      description: '',
      total_price: '',
      fee_option: 'standard',
      applied_fee: '',
      image: [],
      categories: [],
      created_for: null,
    },
  });

  const feeOption = watch('fee_option');
  const categoriesData = watch('categories');
  const createdFor = watch('created_for');

  let appliedFees =
    feeOption === 'standard'
      ? settingData?.details?.readings_standard_fee
      : settingData?.details?.readings_extras_package_fee;

  const createServiceHandler = async (data) => {
    console.log('🚀 ~ createServiceHandler ~ data:', data);
    const payload = {
      title: data?.title,
      description: data?.description,
      total_price: data?.total_price,
      type: data?.type,
      fee_option: data?.fee_option,
      applied_fee: createdFor?.role === 'admin' ? 0 : appliedFees,
      banner_image: data?.banner_image,
      image: data?.image,
      categories: data?.categories ? data?.categories?.map((e) => e.value) : [],
      created_for: data?.created_for?.value,
    };

    try {
      await dispatch(createService(payload)).unwrap();
      router.push('/admin/services');
    } catch (error) {
      if (error.code === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
          console.log('🚀 ~ Object.entries ~ field:', error.data);

          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
    }
  };

  const radioOptions = [
    {
      label: `Standard (${createdFor?.role === 'admin' ? 0 : settingData?.details?.readings_standard_fee} %)`,
      value: 'standard',
    },
    {
      label: `Exclusive Package (${createdFor?.role === 'admin' ? 0 : settingData?.details?.readings_extras_package_fee} %)`,
      value: 'extras_package',
    },
  ];

  let optForAutoComplete = allCategory?.map((e) => ({
    label: e.name,
    value: e.id,
  }));
  // ?.filter(
  //   (e) =>
  //     e.type === 'service_category' && !categoriesData.some((category) => category.value === e.id)
  // )

  const getAllCategories = () =>
    dispatch(categoriesGet({ userData: null, type: 'service_category' }));
  const handleFileUpload = (e, fieldName) => {
    clearErrors(fieldName);
    setValue(fieldName, e);
  };
  const handleFileDelete = () => true;

  // const getUsers = async () => {
  //   try {
  //     setIsUserFecthingloading(true);
  //     // const { data } = await axiosInstance.get(path);
  //     setAllUsers(data.response.details);
  //   } catch (error) {
  //   } finally {
  //     setIsUserFecthingloading(false);
  //   }
  // };

  return (
    <UICard
      pageHeight
      heading={'Create Service'}
      backButton
      bottomActions={
        <UIButton
          // isLoading={loading} // Show loading state
          isLoading={loading} // Show loading state
          // type="submit"
          onClick={handleSubmit(createServiceHandler)}
          sx={{ mt: '20px' }}
        >
          Create Service
        </UIButton>
      }
    >
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <UIAutocomplete
            options={allUsers.map((e) => ({
              label: e.first_name + ' ' + e.last_name,
              value: e.id,
            }))}
            label="Created for"
            name="created_for"
            placeholder="Created for"
            fullWidth
            multiple={false}
            url="users?roles[]=admin&roles[]=light_worker&includeAdmin=true&registration_status=approved"
            control={control}
            errorMessage={errors?.created_for?.message}
            // onOpen={getUsers}
            isLoading={isUserFecthingloading}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <UIInputField
            name="title"
            errorMessage={errors.title?.message}
            control={control}
            placeholder="Title"
            label="Title"
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <UIInputField
            name="total_price"
            errorMessage={errors.total_price?.message}
            control={control}
            placeholder="Price"
            label="Price"
            type="number"
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <UISelect
            name="type"
            multiline
            errorMessage={errors.type?.message}
            control={control}
            placeholder="Type"
            label="Type"
            options={[
              {
                label: 'Reading to - One Off',
                value: 'service',
              },
              ...(user?.country_code === 'AU'
                ? [
                  {
                    label: 'Class to - Monthly Subscription',
                    value: 'class',
                  },
                ]
                : []),
            ]}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <UIAutocomplete
            options={optForAutoComplete}
            label="Categories"
            name="categories"
            placeholder="Categories"
            fullWidth
            control={control}
            errorMessage={errors?.categories?.message}
            onOpen={getAllCategories}
            isLoading={categoriesLoading}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <UIInputField
            name="description"
            multiline
            minRows={4}
            label="Description"
            maxRows={4}
            errorMessage={errors.description?.message}
            control={control}
            placeholder="Description"
            fullWidth
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Typography fontWeight="800" variant="h5">
            Fee Option
          </Typography>
          <UIRadio name="fee_option" control={control} options={radioOptions} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <UIFileUploader
            label="Service Images"
            showDelBtn
            multiple
            onChange={(e) => handleFileUpload(e, 'image')}
            onDel={handleFileDelete}
            errorMessage={errors.image?.message}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <UIFileUploader
            label="Featured Image"
            title="Upload Image"
            onChange={(e) => handleFileUpload(e, 'banner_image')}
            errorMessage={errors.banner_image?.message}
          />
        </Grid2>
      </Grid2>
    </UICard>
  );
};

export default Create;
