'use client';

import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid2, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation'; // Import `useParams` to get the service ID from the URL
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIAutocomplete,
  UIButton,
  UICard,
  UIFileUploader,
  UIInputField,
  UISelect,
  UIRadio,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { categoriesGet } from '@/store/admin/categories/categories.thunk';
import {
  deleteServiceImage,
  getServiceById,
  updateService,
} from '@/store/light-worker/services/services.thunk'; // Assuming these APIs exist
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import { servicesSchema } from './schema';

const UpdateService = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams(); // Get the service ID from URL params
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [allUsers, setAllUsers] = useState([]);
  const [isUserFecthingloading, setIsUserFecthingloading] = useState(false);

  const [, loadingFetch, errorFetch, serviceData] = useApiRequest(getServiceById, {
    initFetch: true,
    apiProps: {
      params: { id },
    },
  });
  // const [updateServiceApi, loading, error, data] = useApiRequest(updateService, {
  //   initFetch: false,
  // });
  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { loading } = useSelector((state) => state.services);
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });

  let isAdmin = user?.role === 'admin';

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
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
      categories: [],
      banner_image: '',
      created_for: null,
    },
  });

  const feeOption = watch('fee_option');
  const categoriesData = watch('categories');
  const createdFor = watch('created_for');
  console.log('🚀 ~ UpdateService ~ createdFor:', createdFor);

  let appliedFees =
    feeOption === 'standard'
      ? settingData?.details?.readings_standard_fee
      : settingData?.details?.readings_extras_package_fee;

  useEffect(() => {
    if (serviceData) {
      const data = {
        label:
          serviceData?.details?.created_by?.first_name +
          ' ' +
          serviceData?.details?.created_by?.last_name,
        value: serviceData?.details?.created_by?.id,
        role: serviceData?.details?.created_by?.role,
      };
      reset({
        title: serviceData?.details?.title,
        description: serviceData?.details?.description,
        total_price: serviceData?.details?.total_price,
        fee_option: serviceData?.details?.fee_option,
        type: serviceData?.details?.type,
        banner_image: serviceData?.details?.banner_image || '',
        image: serviceData?.details?.image,
        categories: serviceData?.details?.categories?.map((e) => ({
          label: e.name,
          value: e.id,
        })),
        created_for: data,
      });
    }
  }, [serviceData]);

  const updateServiceHandler = async (data) => {
    try {
      const payload = {
        title: data?.title,
        description: data?.description,
        total_price: data?.total_price,
        type: data?.type,
        fee_option: data?.fee_option,
        applied_fee: createdFor?.role === 'admin' ? 0 : appliedFees,
        categories: data?.categories ? data?.categories?.map((e) => e.value) : [],
        created_for: data?.created_for?.value,
      };
      if (typeof data?.banner_image !== 'string') {
        payload.banner_image = data?.banner_image;
      }
      if (data?.image.some((each) => typeof each !== 'string')) {
        console.log(
          "🚀 ~ updateServiceHandler ~ typeof data?.image !== 'string':",
          typeof data?.image !== 'string'
        );
        payload.image = data?.image;
      }

      await dispatch(updateService({ params: { id }, payload })).unwrap();
      router.push('/admin/services'); // Redirect after successful update
    } catch (error) {
      console.log('🚀 ~ updateServiceHandler ~ error:', error);
      if (error.code === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
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

  const getAllCategories = () => dispatch(categoriesGet({ type: 'service_category' }));
  const handleFileUpload = (e, fieldName) => {
    setValue(fieldName, e);
  };

  const handleFileDelete = (imageIndex) => {
    return dispatch(deleteServiceImage({ params: { id, imageIndex } }))
      .unwrap()
      .then((res) => {
        addToast({ message: res?.message, severity: 'success' });
        return true;
      })
      .catch((error) => {
        setError('image', { type: 'manual', message: error?.data?.image });
        return false;
      });
  };

  let optForAutoComplete = allCategory
    ?.filter(
      (e) =>
        e.type === 'service_category' &&
        !categoriesData?.some((category) => category.value === e.id)
    )
    .map((e) => ({
      label: e.name,
      value: e.id,
    }));

  const getUsers = async () => {
    try {
      setIsUserFecthingloading(true);
      const { data } = await axiosInstance.get(
        'users?roles[]=admin&roles[]=light_worker&includeAdmin=true&registration_status=approved'
      );
      setAllUsers(data.response.details);
    } catch (error) {
    } finally {
      setIsUserFecthingloading(false);
    }
  };

  return (
    <ApiLoader loading={loadingFetch} error={errorFetch}>
      <UICard
        pageHeight
        heading={'Update Service'}
        backButton
        bottomActions={
          <UIButton
            disabled={loading}
            isLoading={loading} // Show loading state
            onClick={handleSubmit(updateServiceHandler)}
            sx={{ mt: '20px' }}
          >
            Update Service
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
              label="Title"
              name="title"
              errorMessage={errors.title?.message}
              control={control}
              placeholder="Title"
              fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
            <UIInputField
              label="Price"
              name="total_price"
              errorMessage={errors.total_price?.message}
              control={control}
              placeholder="Price"
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
              disabled={true}
              options={[
                {
                  label: 'Reading to - One Off',
                  value: 'service',
                },
                {
                  label: 'Class to - monthly Subscription ',
                  value: 'class',
                },
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
              label="Description"
              name="description"
              multiline
              minRows={4}
              maxRows={4}
              errorMessage={errors?.description?.message}
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
              label="Featured Image"
              name="banner_image"
              onChange={(e) => handleFileUpload(e, 'banner_image')}
              control={control}
              initialImages={
                serviceData?.details?.banner_image ? [serviceData?.details?.banner_image] : []
              }
              errorMessage={errors.banner_image?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <UIFileUploader
              label="Service Images"
              showDelBtn
              multiple
              onChange={(e) => handleFileUpload(e, 'image')}
              initialImages={serviceData?.details?.image}
              onDel={handleFileDelete}
              errorMessage={errors.image?.message}
            />
          </Grid2>
        </Grid2>
      </UICard>
    </ApiLoader>
  );
};

export default UpdateService;
