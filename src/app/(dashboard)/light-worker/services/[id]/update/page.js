'use client';
import { useEffect } from 'react';

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
  UIRadio,
  UISelect,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { categoriesGet } from '@/store/admin/categories/categories.thunk';
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import {
  deleteServiceImage,
  getServiceById,
  updateService,
} from '@/store/light-worker/services/services.thunk'; // Assuming these APIs exist
import { servicesSchema } from './schema';

const UpdateService = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { id } = useParams(); // Get the service ID from URL params
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [, loadingFetch, errorFetch, serviceData] = useApiRequest(getServiceById, {
    initFetch: true,
    apiProps: {
      params: { id },
    },
  });
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });
  const [updateServiceApi, loading, error, data] = useApiRequest(updateService, {
    initFetch: false,
  });
  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
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
    },
  });

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

  const feeOption = watch('fee_option');
  const categoriesData = watch('categories');

  let appliedFees =
    feeOption === 'standard'
      ? settingData?.details?.readings_standard_fee
      : settingData?.details?.readings_extras_package_fee;

  useEffect(() => {
    if (serviceData) {
      console.log('🚀 ~ useEffect ~ serviceData:', serviceData);
      reset({
        title: serviceData?.details?.title,
        description: serviceData?.details?.description,
        total_price: serviceData?.details?.total_price,
        fee_option: serviceData?.details?.fee_option,
        applied_fee: serviceData?.details?.applied_fee,
        type: serviceData?.details?.type,
        banner_image: serviceData?.details?.banner_image || '',
        image: serviceData?.details?.image,
        categories: serviceData?.details?.categories?.map((e) => ({
          label: e.name,
          value: e.id,
        })),
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
        fee_option: isAdmin ? 'standard' : data?.fee_option,
        applied_fee: isAdmin ? 0 : appliedFees,
        categories: data?.categories ? data?.categories?.map((e) => e.value) : [],
      };
      console.log('🚀 ~ updateServiceHandler ~ payload:', payload);
      if (typeof data?.banner_image !== 'string') {
        payload.banner_image = data?.banner_image;
      }
      if (data?.image.some((each) => typeof each !== 'string')) {
        payload.image = data?.image;
      }

      await updateServiceApi({ params: { id }, payload });
      router.push('/light-worker/services'); // Redirect after successful update
    } catch (error) {
      console.log('🚀 ~ updateServiceHandler ~ error:', error?.details);
      if (error?.details?.code === 422 && error?.details?.data) {
        Object.entries(error?.details?.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
    }
  };

  const getAllCategories = () => dispatch(categoriesGet());

  const radioOptions = [
    { label: `Standard (${settingData?.details?.readings_standard_fee} %)`, value: 'standard' },
    {
      label: `Exclusive Package (${settingData?.details?.readings_extras_package_fee} %)`,
      value: 'extras_package',
    },
  ];

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

  return (
    <UICard
      pageHeight
      heading={'Update Service'}
      backButton
      bottomActions={
        <UIButton
          disabled={!!errorFetch || loadingFetch}
          isLoading={loading} // Show loading state
          onClick={handleSubmit(updateServiceHandler)}
          sx={{ mt: '20px' }}
        >
          Update Service
        </UIButton>
      }
    >
      <ApiLoader loading={loadingFetch} error={errorFetch}>
        <Grid2 container spacing={3}>
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

          <Grid2 size={{ xs: 12, md: 6 }}>
            <UIInputField
              name="total_price"
              errorMessage={errors.total_price?.message}
              control={control}
              placeholder="Price"
              type="number"
              label="Price"
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
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
                {
                  label: 'Class to - monthly Subscription',
                  value: 'class',
                },
              ]}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
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
              maxRows={4}
              errorMessage={errors.description?.message}
              control={control}
              placeholder="Description"
              fullWidth
            />
          </Grid2>
          {user?.role != 'admin' && (
            <Grid2 size={{ xs: 12 }}>
              <Typography fontWeight="800" variant="h5">
                Package Options
              </Typography>
              <UIRadio name="fee_option" control={control} options={radioOptions} />
            </Grid2>
          )}
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
        </Grid2>
      </ApiLoader>
    </UICard>
  );
};

export default UpdateService;
