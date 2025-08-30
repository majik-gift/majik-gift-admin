'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  ApiLoader,
  UiApiSearchableSelectBox,
  UIButton,
  UICard,
  UIDatePicker,
  UIInputField,
  UISelect,
} from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { couponCreateSchema } from './schema';

const CreateCoupons = ({ fixedType }) => {
  const { user } = useSelector((state) => state.auth);
  const [dataOpt, setDataOpt] = useState({ service: null, product: null, event: null });
  const isAdmin = user?.role === 'admin'
  const router = useRouter();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { action } = useParams();
  const [type, id] = action || [];
  const isUpdate = type === 'update' && id;
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(couponCreateSchema),
    defaultValues: {
      type: fixedType || 'event',
      service_id: {
        label: '',
        id: null,
      },
      product_id: {
        label: '',
        id: null,
      },
      event_id: {
        label: '',
        id: null,
      },
      code: '',
      discount_percentage: 0,
      usage_limit: 0,
      expire_at: null,
    },
  });

  const formData = watch();

  const getDependence = async () => {
    try {
      let services = null;
      let products = null;
      let events = null;

      // Fetch data based on the fixedType
      if (fixedType === 'service') {
        const { data } = await axiosInstance.get('service?perPage=99999');
        services = data?.response?.details?.map((e) => ({ label: e.title, value: e.id }));
      } else if (fixedType === 'product') {
        console.log('🚀 ~ getDependence ~ fixedType:', fixedType);
        const { data } = await axiosInstance.get('products?perPage=99999');
        console.log('🚀 ~ getDependence ~ data:', data.response.details);
        products = data.response?.details?.map((e) => ({ label: e.name, value: e.id }));
      } else if (fixedType === 'event') {
        const { data } = await axiosInstance.get('events?perPage=99999');
        events = data?.response?.details?.map((e) => ({ label: e.title, value: e.id }));
      } else {
        // If no fixedType, fetch all dependencies
        const [servicesRes, productsRes, eventsRes] = await Promise.all([
          axiosInstance.get('service?perPage=99999'),
          axiosInstance.get('products?perPage=99999'),
          axiosInstance.get('events?perPage=99999'),
        ]);
        services = servicesRes?.data?.response?.details?.map((e) => ({
          label: e.title,
          value: e.id,
        }));
        products = productsRes?.data?.response?.details?.map((e) => ({
          label: e.name,
          value: e.id,
        }));
        events = eventsRes?.data?.response?.details?.map((e) => ({ label: e.title, value: e.id }));
      }

      // Update state with the fetched data
      setDataOpt({
        service: services,
        product: products,
        event: events,
      });
    } catch (error) {
      console.error('Error fetching dependencies:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // const [services, products, events] = await Promise.all([
      //   dispatch(getServices()),
      //   dispatch(getProducts()),
      //   dispatch(getEvents()),
      // ]);

      // setDataOpt({
      //   service: services?.payload?.details?.map((e) => ({ label: e.title, value: e.id })),
      //   product: products?.payload?.details?.map((e) => ({ label: e.name, value: e.id })),
      //   event: events?.payload?.details?.map((e) => ({ label: e.title, value: e.id })),
      // });
      // getDependence();

      if (isUpdate) {
        try {
          const { data } = await axiosInstance.get(`coupons/coupon?id=${id}`);
          setValue('code', data.response.details.code);
          setValue('discount_percentage', data.response.details.discount_percentage);
          setValue('usage_limit', data.response.details.usage_limit);
          setValue('expire_at', dayjs(data.response.details.expire_at));
          setValue('type', fixedType || data.response.details.type);
          setValue('status', data.response.details.status);
          setValue(`${data.response.details.type}_id`, {
            label:
              data.response.details[data.response.details.type]?.title ||
              data.response.details[data.response.details.type]?.name ||
              '',
            id: data.response.details[data.response.details.type]?.id || null,
          });
          console.log('🚀 ~ fetchData ~ data.response.details.type:', data.response.details.type);
        } catch (error) {
          console.error('Failed to fetch coupon:', error);
          addToast({ message: 'Failed to fetch coupon details', severity: 'error' });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isUpdate, id, fixedType]);

  const createProductHandler = async (dataToSend) => {
    const data = {
      ...dataToSend,
      product_id: dataToSend?.product_id?.id,
      service_id: dataToSend?.service_id?.id,
      event_id: dataToSend?.event_id?.id,
    };
    try {
      setSubmitLoading(true);
      const url = isUpdate ? `coupons/${id}` : 'coupons';
      const method = isUpdate ? 'patch' : 'post';

      const res = await axiosInstance[method](url, data);
      addToast({ message: res?.data?.message, severity: 'success' });
      router.back();
    } catch (error) {
      if (error.response?.status !== 422) {
        addToast({ message: error.response?.data?.message || error.message, severity: 'error' });
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  const entityField = useMemo(() => {
    return {
      event: 'event_id',
      service: 'service_id',
      product: 'product_id',
    }[fixedType || formData?.type];
  }, [fixedType, formData?.type]);

  console.log('🚀 ~ entityField ~ entityField:', entityField);

  useEffect(() => {
    if (!isLoading) {
      setValue('service_id', formData.type === 'service' ? formData.service_id : null);
      setValue('product_id', formData.type === 'product' ? formData.product_id : null);
      setValue('event_id', formData.type === 'event' ? formData.event_id : null);
    }
  }, [formData.type, isLoading]);

  if (!['create', 'update'].includes(type)) {
    return router.back();
  }

  return (
    <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit(createProductHandler)}>
      <UICard
        backButton
        heading={`${isUpdate ? 'Update' : 'Create'} coupon`}
        bottomActions={
          <UIButton isLoading={submitLoading} fullWidth type="submit" sx={{ maxWidth: 200 }}>
            {isUpdate ? 'Update' : 'Create'}
          </UIButton>
        }
      >
        <ApiLoader loading={isLoading}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <UIInputField
                label="Coupon Code"
                name="code"
                placeholder="code"
                type="text"
                fullWidth
                control={control}
                errorMessage={errors?.code?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UIInputField
                label="Discount percentage"
                name="discount_percentage"
                placeholder="Discount percentage"
                type="number"
                fullWidth
                control={control}
                errorMessage={errors?.discount_percentage?.message}
                defaultValue={0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UIInputField
                label="Usage limit"
                name="usage_limit"
                placeholder="Usage limit"
                type="number"
                fullWidth
                control={control}
                errorMessage={errors?.usage_limit?.message}
                defaultValue={0}
              />
            </Grid>
            {!fixedType && (
              <Grid item xs={12} sm={6}>
                <UISelect
                  control={control}
                  fullWidth
                  label="Type"
                  name="type"
                  errorMessage={errors?.type?.message}
                  options={[
                    { label: 'Group Activities', value: 'event' },
                    { label: 'Service', value: 'service' },
                    ...(isAdmin ? [{ label: 'Product', value: 'product' }] : []),
                  ]}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              {/* <UISelect
                control={control}
                fullWidth
                label="Entity"
                name={entityField}
                errorMessage={errors?.[entityField]?.message}
                options={dataOpt[formData.type] || []}
              /> */}
              <UiApiSearchableSelectBox
                label={fixedType ? capitalize(fixedType) : capitalize(`${formData?.type}s`)}
                apiEndpoint={formData?.type === 'service' ? formData.type : `${formData?.type}s`} // Replace with your API endpoint
                searchParam="search" // Replace with your API's search parameter
                control={control}
                name={entityField}
                extraParams={{
                  registration_status: 'approved',
                }}
                errorMessage={errors?.[entityField]?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UIDatePicker
                label="Expire at"
                name="expire_at"
                placeholder="Expire at"
                fullWidth
                control={control}
                errorMessage={errors?.expire_at?.message}
                minDate={dayjs().add('1', 'day')}
              />
            </Grid>
            {isUpdate && (
              <Grid item xs={12} sm={6}>
                <UISelect
                  control={control}
                  fullWidth
                  label="Status"
                  name="status"
                  errorMessage={errors?.status?.message}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'In Active', value: 'inactive' },
                  ]}
                />
              </Grid>
            )}
          </Grid>
        </ApiLoader>
      </UICard>
    </Box>
  );
};

export default CreateCoupons;
