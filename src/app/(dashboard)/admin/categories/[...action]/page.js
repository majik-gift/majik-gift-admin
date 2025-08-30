'use client';

import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid2, Stack, Typography } from '@mui/material';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIButton,
  UICard,
  UIFileUploader,
  UIInputField,
  UISelect,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import {
  createCategory,
  getSingleCategory,
  updateCategory,
} from '@/store/admin/categories/categories.thunk';
import { clearSuccess } from '@/store/products/products.slice';
import { categoryCreateSchema } from './category-create-schema';

const CreateCategory = () => {
  const { singleCategory } = useSelector((state) => state.categories);

  const { user } = useSelector((state) => state.auth);

  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { action } = useParams();
  const [type, id] = action || [];
  const isUpdate = type === 'update' && id;
  let isAdmin = user?.role === 'admin';

  const [singleCategoryData, loading, getSingleError] = useApiRequest(getSingleCategory, {
    initFetch: Boolean(id),
    apiProps: {
      params: { id },
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(categoryCreateSchema),
    defaultValues: {
      name: '',
      type: '',
    },
  });

  let icon = watch('icon');

  useEffect(() => {
    if (isUpdate && singleCategory) {
      Object.keys(singleCategory).forEach((key) => {
        console.log('🚀 ~ Object.keys ~ key:', key);
        if (['name', 'type', 'icon'].includes(key)) {
          setValue(key, singleCategory[key]);
        }
      });
    }
  }, [singleCategory, setValue, isUpdate]);

  const createProductHandler = async (dataToSend) => {
    let res;
    try {
      if (isUpdate) {
        res = await dispatch(updateCategory({ params: { id }, payload: dataToSend })).unwrap();
      } else {
        res = await dispatch(createCategory(dataToSend)).unwrap();
      }
      addToast({ message: res?.message, severity: 'success' });
      dispatch(clearSuccess());
      router.push('/admin/categories');
    } catch (error) {
      if (error.status === 422 && error?.data) {
        Object.entries(error.data).forEach(([field, message]) => {
          setError(field, { type: 'manual', message });
        });
      } else {
        addToast({ message: error?.message, severity: 'error' });
      }
      // if (error.status != 422) {
      //   addToast({ message: error?.message, severity: 'error' });
      // }
    }
  };

  const handleFileUpload = (fieldName) => (e) => setValue(fieldName, e);

  if (type !== 'create' && type !== 'update') {
    return notFound();
  }

  return (
    <ApiLoader loading={loading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(createProductHandler)}>
        <UICard backButton pageHeight heading={`${isUpdate ? 'Update' : 'Create'} Category`}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label={'Name'}
                name={'name'}
                placeholder={'Name'}
                type={'text'}
                fullWidth
                control={control}
                errorMessage={errors?.name?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIInputField
                label="Icon Class"
                name="icon"
                placeholder="Add Icon Class"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors?.icon?.message}
                helperText={
                  <Typography variant="body2">
                    Please pick up the font class from{' '}
                    <a
                      href="https://fontawesome.com/v4/icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      here
                    </a>{' '}
                    above button link and just put it in the field. For Example: fa-users (which
                    will show users icons).
                  </Typography>
                }
                icon={<i className={`fa ${icon && icon}`} aria-hidden="true"></i>}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UISelect
                control={control}
                fullWidth
                label="Type"
                name="type"
                errorMessage={errors?.type?.message}
                options={[
                  {
                    label: 'Group Activities',
                    value: 'event_category',
                  },
                  {
                    label: 'Service',
                    value: 'service_category',
                  },
                  {
                    label: 'Product',
                    value: 'product_category',
                  },
                ]}
              />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 6 }}></Grid2> */}
            <Grid2 size={12}>
              <UIFileUploader
                label="Category Image"
                onChange={handleFileUpload('image')}
                initialImages={isUpdate && singleCategory?.image ? [singleCategory?.image] : []}
                errorMessage={errors.image?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Stack alignItems="center">
                <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={loading}>
                  {isUpdate ? 'Update' : 'Create'}
                </UIButton>
              </Stack>
            </Grid2>
          </Grid2>
        </UICard>
      </Box>
    </ApiLoader>
  );
};

export default CreateCategory;
