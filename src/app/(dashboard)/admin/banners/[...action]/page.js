'use client';

import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { bannerCreateSchema } from './banner-create-schema';
import {
  UIAutocomplete,
  UIButton,
  UICard,
  UIFileUploader,
  UIInputField,
  UISelect,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { createBanner, getSingleBanner, updateBanner } from '@/store/admin/banners/banners.thunk';
import { getEvents } from '@/store/light-worker/events/events.thunk';
import { getServices } from '@/store/light-worker/services/services.thunk';
import { getProducts } from '@/store/products/products.thunk';
import { getUsers } from '@/store/admin/users/users.thunks';
import axiosInstance from '@/shared/services/axiosInstance';
import { errorSetter } from '@/shared/helpers/errorSetter';

const CreateBanner = () => {
  const { user } = useSelector((state) => state.auth);
  const banner = useSelector((state) => state.banner);
  const [dataOpt, setDataOpt] = useState({ service: null, product: null, event: null });
  const [singleBanner, setSingleBanner] = useState(null);
  const [entityField, setEntityField] = useState('');

  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { action } = useParams();
  const [type, id] = action || [];
  const isUpdate = type === 'update' && id;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(bannerCreateSchema),
    defaultValues: {
      type: '',
      service_id: null,
      product_id: null,
      event_id: null,
      title: '',
    },
  });

  const formData = watch();

  useEffect(() => {
    const fetchData = async () => {
      const [services, products, events, light_worker] = await Promise.all([
        dispatch(getServices({ perPage: 999 })),
        dispatch(getProducts({ perPage: 999 })),
        dispatch(getEvents({ perPage: 999 })),
        dispatch(
          getUsers({
            role: 'light_worker',
            registration_status: 'approved',
            perPage: 999,
            status: 'active',
          })
        ),
      ]);

      setDataOpt({
        service: services?.payload?.details?.map((e) => ({ label: e.title, value: e.id })),
        product: products?.payload?.details?.map((e) => ({ label: e.name, value: e.id })),
        event: events?.payload?.details?.map((e) => ({ label: e.title, value: e.id })),
        light_worker: light_worker?.payload?.details?.map((e) => ({
          label: `${e.first_name} ${e.last_name}`,
          value: e.id,
        })),
      });
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setValue('service_id', null);
    setValue('product_id', null);
    setValue('event_id', null);
    setValue('light_worker_id', null);
  }, [formData.type, setValue]);

  const createProductHandler = async (dataToSend) => {
    const payload = {
      // banner_image: dataToSend?.banner_image,
      type: dataToSend?.type,
      event_id: dataToSend?.event_id?.value,
      order_id: dataToSend?.order_id?.value,
      service_id: dataToSend?.service_id?.value,
      light_worker_id: dataToSend?.light_worker_id?.value,
      product_id: dataToSend?.product_id?.value,
      order_by: dataToSend?.order_by,
      title: dataToSend?.title,
      button_text_color: dataToSend?.button_text_color,
      button_text: dataToSend?.button_text,
    };
    if (dataToSend?.banner_image instanceof File || dataToSend?.banner_image instanceof Blob) {
      payload.banner_image = dataToSend.banner_image;
    }
    try {
      let res;
      if (isUpdate) {
        res = await dispatch(updateBanner({ params: { id }, payload })).unwrap();
      } else {
        res = await dispatch(createBanner(payload)).unwrap();
      }
      if (res?.error) {
        throw res.error;
      } else {
        addToast({ message: res.message, severity: 'success' });
        router.push('/admin/banners');
      }
    } catch (error) {
      if (error.code !== 422) {
        addToast({ message: error.message, severity: 'error' });
      } else {
        errorSetter(error, setError);
      }
    }
  };

  const handleFileUpload = (e, fieldName) => setValue(fieldName, e);

  if (!['create', 'update'].includes(type)) {
    return <div>Invalid action</div>;
  }

  const getSingleBanner = async () => {
    try {
      const res = await axiosInstance.get(`admin/banner/${id}`);
      setSingleBanner(res.data.response.details);
    } catch (error) {
      console.log('Error fetching banner details:', error);
    }
  };

  useEffect(() => {
    const entityField = {
      event: 'event_id',
      service: 'service_id',
      product: 'product_id',
      light_worker: 'light_worker_id',
    }[formData.type];
    setEntityField(entityField);
  }, [formData?.type]);

  useEffect(() => {
    if (id) {
      getSingleBanner();
    }
  }, [id]);

  useEffect(() => {
    if (isUpdate && singleBanner) {
      Object.keys(singleBanner).forEach((key) => {
        if (key === formData.type) {
          setValue(entityField, {
            value: singleBanner[key]?.id,
            label:
              singleBanner[key]?.name ||
              singleBanner[key]?.description ||
              singleBanner[key]?.full_name,
          });
        } else {
          setValue(key, singleBanner[key]);
        }
      });
    }
  }, [singleBanner, setValue, isUpdate]);

  useEffect(() => {
    if (isUpdate && singleBanner) {
      Object.keys(singleBanner).forEach((key) => {
        if (singleBanner[formData.type] && key === formData.type) {
          setValue(entityField, {
            value: singleBanner[key]?.id,
            label:
              singleBanner[key]?.name ||
              singleBanner[key]?.description ||
              singleBanner[key]?.full_name,
          });
        }
      });
    }
  }, [formData?.type, entityField]);

  return (
    <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(createProductHandler)}>
      <UICard backButton pageHeight heading={`${isUpdate ? 'Update' : 'Create'} Banner`}>
        <Stack spacing={2}>
          <UISelect
            control={control}
            fullWidth
            label="Type"
            name="type"
            errorMessage={errors?.type?.message}
            options={[
              { label: 'Group Activities', value: 'event' },
              { label: 'Service', value: 'service' },
              { label: 'Product', value: 'product' },
              { label: 'Light Worker', value: 'light_worker' },
            ]}
          />
          <UIAutocomplete
            name={entityField}
            placeholder="Select Entity"
            label="Entity"
            errorMessage={errors?.[entityField]?.message}
            control={control}
            multiple={false}
            errors={errors[entityField]}
            fullWidth
            url={url[formData?.type]}
          />
          <UIInputField
            label="Title"
            name="title"
            placeholder="Title"
            type="text"
            fullWidth
            control={control}
            errorMessage={errors?.title?.message}
          />
          <UIInputField
            label="Order By"
            name="order_by"
            placeholder="Order By"
            type="number"
            fullWidth
            control={control}
            errorMessage={errors?.order_by?.message}
          />
          <UIInputField
            label="Title Color"
            name="button_text_color"
            placeholder="Enter Title Color"
            type="text"
            fullWidth
            control={control}
            errorMessage={errors?.button_text_color?.message}
          />
          <UIInputField
            label="Button Text"
            name="button_text"
            placeholder="Enter button Text"
            type="text"
            fullWidth
            control={control}
            errorMessage={errors?.button_text?.message}
          />
          <UIFileUploader
            label="Banner Image"
            title="Upload Image"
            onChange={(e) => handleFileUpload(e, 'banner_image')}
            errorMessage={errors?.banner_image?.message}
            initialImages={isUpdate ? [singleBanner?.banner_image] : []}
            heightMin={250}
            heightMax={280}
          />

          <Stack alignItems="center">
            <UIButton fullWidth type="submit" sx={{ maxWidth: 200 }} isLoading={banner.loading}>
              {isUpdate ? 'Update' : 'Create'}
            </UIButton>
          </Stack>
        </Stack>
      </UICard>
    </Box>
  );
};

export default CreateBanner;

const url = {
  service: `service?`,
  event: `events?`,
  light_worker: `users?role=light_worker&registration_status=approved&status=active`,
  product: `products?`,
};
