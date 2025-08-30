'use client';

import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid2, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import {
  ApiLoader,
  UIAutocomplete,
  UIButton,
  UICard,
  UIDatePicker,
  UIFileUploader,
  UIInputField,
  UIRadio,
  UITimePicker,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { categoriesGet } from '@/store/admin/categories/categories.thunk';
import { settingsGet } from '@/store/admin/settings/setting.thunk';
import {
  createEvent,
  deleteEventImage,
  getSingleEvent,
  updateEvent,
} from '@/store/light-worker/events/events.thunk';
import { eventCreateSchema } from './event-create-schema';

const CreateEvent = () => {
  const { loading, singleEvent, singleEventLoading } = useSelector((state) => state.event);
  const { allCategory, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  const [getSettingData, settingLoading, _k, _j, _i, _h, settingData] = useApiRequest(settingsGet, {
    initFetch: true,
  });

  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [isUserFecthingloading, setIsUserFecthingloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { action } = useParams();
  const [type, id] = action || [];
  const isUpdate = type === 'update' && id;
  let isAdmin = user?.role === 'admin';

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(eventCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      total_price: '',
      banner_image: null,
      image: [],
      fee_option: 'standard',
      applied_fee: 0,
      categories_ids: [],
      event_date: null,
      created_for: null,
    },
    context: { singleEvent },
  });
  const feeOption = watch('fee_option');
  const categoriesData = watch('categories_ids');
  const createdFor = watch('created_for');

  let appliedFees =
    feeOption === 'standard'
      ? settingData?.details?.ticket_sales_standard_fee
      : settingData?.details?.ticket_sales_extras_package_fee;

  const radioOptions = [
    {
      label: `Standard (${createdFor?.role === 'admin' ? 0 : settingData?.details?.ticket_sales_standard_fee} %)`,
      value: 'standard',
    },
    {
      label: `Exclusive Package (${createdFor?.role === 'admin' ? 0 : settingData?.details?.ticket_sales_extras_package_fee} %)`,
      value: 'extras_package',
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getSingleEvent({ params: { id } }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isUpdate && singleEvent) {
      Object.keys(singleEvent).forEach((key) => {
        if (!['banner_image', 'image'].includes(key)) {
          let value = singleEvent[key];

          if (['start_time', 'end_time', 'event_date'].includes(key)) {
            if (key === 'event_date') {
              value = dayjs(value);
            } else {
              value = dayjs.unix(value);
            }
          }
          if (key === 'organizer') {
            const data = {
              label: singleEvent.organizer.first_name + ' ' + singleEvent.organizer.last_name,
              value: singleEvent.organizer.id,
            };
            setValue('created_for', data);
          }

          if (key === 'categories') {
            value = singleEvent.categories.map((e) => ({
              label: e.name,
              value: e.id,
            }));
            setValue('categories_ids', value);
          } else {
            setValue(key, value);
          }
        }
      });
    }
  }, [singleEvent, setValue, isUpdate]);

  const createProductHandler = async (dataToSend) => {
    const payload = {
      description: dataToSend.description,
      total_price: dataToSend.total_price,
      banner_image: dataToSend.banner_image,
      image: dataToSend?.image,
      event_date: dayjs(dataToSend?.event_date).toISOString(),
      categories_ids: dataToSend?.categories_ids
        ? dataToSend?.categories_ids?.map((e) => e.value)
        : [],
      slots: dataToSend.slots,
      venue: dataToSend.venue,
      start_time: dayjs(dataToSend.start_time).toISOString(),
      end_time: dayjs(dataToSend.end_time).toISOString(),
      title: dataToSend.title,
      fee_option: dataToSend?.fee_option,
      applied_fee: dataToSend?.created_for?.role === 'admin' ? 0 : appliedFees,
      created_for: dataToSend?.created_for?.value,
    };
    let res;
    try {
      if (isUpdate) {
        setIsLoading(true);
        res = await dispatch(updateEvent({ params: { id }, payload })).unwrap();
      } else {
        res = await dispatch(createEvent(payload)).unwrap();
      }
      addToast({ message: res?.message, severity: 'success' });
      router.push(isAdmin ? '/admin/events' : '/light-worker/events');
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
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e, fieldName) => {
    setValue(fieldName, e);
    clearErrors(fieldName);
  };
  const handleFileDelete = (imageIndex) => {
    if (!isUpdate) {
      return true;
    }
    return dispatch(deleteEventImage({ params: { id, imageIndex } }))
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
  const getAllCategories = (data) => () =>
    dispatch(categoriesGet({ userData: data, type: 'event_category' }));

  if (type !== 'create' && type !== 'update') {
    return <div>Invalid action</div>;
  }

  let optForAutoComplete = allCategory
    ?.filter(
      (e) =>
        e.type === 'event_category' && !categoriesData.some((category) => category.value === e.id)
    )
    ?.map((e) => ({
      label: e.name,
      value: e.id,
    }));

  // const getUsers = async () => {
  //   try {
  //     setIsUserFecthingloading(true);
  //     const { data } = await axiosInstance.get(
  //       'users?roles[]=admin&roles[]=light_worker&includeAdmin=true&registration_status=approved'
  //     );
  //     setAllUsers(data.response.details);
  //   } catch (error) {
  //   } finally {
  //     setIsUserFecthingloading(false);
  //   }
  // };

  return (
    <ApiLoader loading={singleEventLoading}>
      <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(createProductHandler)}>
        <UICard
          backButton
          pageHeight
          heading={`${isUpdate ? 'Update' : 'Create'} Group Activities`}
        >
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              {/* <UIAutocomplete
                // options={allUsers.map((e) => ({
                //   label: e.first_name + ' ' + e.last_name,
                //   value: e.id,
                //   role: e.role,
                // }))}
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
              /> */}
              <UIAutocomplete
                // options={allUsers.map((e) => ({
                //   label: e.first_name + ' ' + e.last_name,
                //   value: e.id,
                // }))}
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
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key="title">
              <UIInputField
                label="Title"
                name="title"
                placeholder="Title"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.title?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key="total_price">
              <UIInputField
                label="Price"
                name="total_price"
                placeholder="Price"
                type="number"
                fullWidth
                control={control}
                errorMessage={errors.total_price?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key="slots">
              <UIInputField
                label="Slots"
                name="slots"
                placeholder="Slots"
                type="number"
                fullWidth
                control={control}
                errorMessage={errors.slots?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key="venue">
              <UIInputField
                label="Venue"
                name="venue"
                placeholder="Venue"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors.venue?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <UIDatePicker
                label="Group Activities Date"
                name="event_date"
                placeholder="Group Activities Date"
                fullWidth
                control={control}
                errorMessage={errors?.event_date?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <UITimePicker
                name="start_time"
                label="Start time"
                errorMessage={errors?.start_time?.message}
                control={control}
                fullWidth
                errors={{}}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <UITimePicker
                name="end_time"
                label="End time"
                errorMessage={errors?.end_time?.message}
                control={control}
                fullWidth
                errors={{}}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <UIAutocomplete
                options={optForAutoComplete}
                label="Categories"
                name="categories_ids"
                placeholder="Categories"
                fullWidth
                control={control}
                errorMessage={errors?.categories_ids?.message}
                onOpen={getAllCategories({ perPage: 999 })}
                isLoading={categoriesLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <UIInputField
                label="Description"
                name="description"
                placeholder="Description"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors?.description?.message}
                multiline
                rows={4}
              />
            </Grid2>
            {/* {!createdFor ||
              (user?.id !== createdFor?.value && ( */}
            <Grid2 size={{ xs: 12 }}>
              <Typography fontWeight="800" variant="h5">
                Fee Option
              </Typography>
              <UIRadio name="fee_option" control={control} options={radioOptions} />
            </Grid2>
            {/* ))} */}

            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIFileUploader
                label="Group Activities Images"
                multiple
                showDelBtn
                onDel={handleFileDelete}
                onChange={(e) => handleFileUpload(e, 'image')}
                initialImages={isUpdate ? singleEvent?.image : []}
                errorMessage={errors?.image?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <UIFileUploader
                label="Featured Image"
                title="Upload Image"
                onChange={(e) => handleFileUpload(e, 'banner_image')}
                initialImages={isUpdate ? [singleEvent?.banner_image] : []}
                errorMessage={errors.banner_image?.message}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Stack alignItems="center">
                <UIButton
                  fullWidth
                  type="submit"
                  sx={{ maxWidth: 200 }}
                  isLoading={loading || isLoading}
                >
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

export default CreateEvent;
