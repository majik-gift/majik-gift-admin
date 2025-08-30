'use client';
import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid2 } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { ApiLoader, UIButton, UICard, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getSingleOrder, updateOrder } from '@/store/admin/orders-history/orders-history.thunk';
import { orderCreateSchema } from './order-create-schema';

const OrderUpdatePage = () => {
  const { orderId: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { singleOrder, singleOrderLoading, error } = useSelector((state) => state.order);
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const { addToast } = useToast();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(orderCreateSchema),
    defaultValues: {
      tracking_id: '',
      carrier_service: '',
    },
  });

  useEffect(() => {
    dispatch(getSingleOrder({ params: { id } }));
  }, [id]);

  useEffect(() => {
    if (error) {
      addToast({
        message: error.message,
        severity: 'error',
      });
    }
  }, [error]);

  useEffect(() => {
    if (singleOrder && !singleOrderLoading) {
      reset({
        tracking_id: singleOrder?.tracking_id,
        carrier_service: singleOrder?.carrier_service,
      });
    }
  }, [singleOrder]);

  const updateSingleOrder = async (data) => {
    try {
      const { payload } = await dispatch(updateOrder({ params: { id }, payload: { ...data } }));
      if (payload) {
        addToast({
          message: payload.message,
          severity: 'success',
        });
        reset();
        router.back();
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <>
      <UICard heading={'Update Order'} backButton>
        <ApiLoader loading={singleOrderLoading}>
          <Grid2 container spacing={2} component="form" onSubmit={handleSubmit(updateSingleOrder)}>
            <Grid2 size={{ xs: 6 }}>
              <UIInputField
                label="Tracking Id"
                name="tracking_id"
                control={control}
                errorMessage={errors?.tracking_id?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <UIInputField
                label="Courier Service"
                control={control}
                name="carrier_service"
                errorMessage={errors?.carrier_service?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <UIButton type="submit">Update</UIButton>
            </Grid2>
          </Grid2>
        </ApiLoader>
      </UICard>
    </>
  );
};

export default OrderUpdatePage;
