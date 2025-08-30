'use client';
import { useEffect, useState } from 'react';
import { Chip, Grid2, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { ApiLoader, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { formatNumber } from '@/hooks/formatNumber';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const OrderDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { orderId: id } = useParams();
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const getServiceOrderById = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`service-orders/${id}`);
      setData(data?.response?.details);
    } catch (error) {
      addToast({
        severity: 'error',
        message: error?.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getServiceOrderById();
  }, []);

  let stripeResponse = {
    stripe_payment_intent_response: data?.stripe_payment_intent_response,
    stripe_success_payment_intent_response: data?.stripe_success_payment_intent_response,
    stripe_payment_refund_response: data?.stripe_payment_refund_response,
    stripe_success_payment_refund_response: data?.stripe_success_payment_refund_response,
    stripe_tip_payment_intent_response: data?.stripe_tip_payment_intent_response,
    stripe_tip_success_payment_intent_response: data?.stripe_tip_success_payment_intent_response,
    stripe_payment_tip_amount_transfer_response: data?.stripe_payment_tip_amount_transfer_response,
    stripe_payment_amount_transfer_response: data?.stripe_payment_amount_transfer_response,
  };

  const renderUserDetails = (data) => {
    return (
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">OrderId</Typography>
          <Typography variant="body1">{data?.id}</Typography>
        </Grid2>
        {/* Name */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Customer Name</Typography>
          <Typography variant="body1">
            {data?.customer?.first_name || data?.customer?.last_name
              ? data?.customer?.first_name + ' ' + data?.customer?.last_name
              : '-'}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Customer Address</Typography>
          <Typography variant="body1">{data?.customer?.address ?? '-'}</Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Customer Phone Number</Typography>
          <Typography variant="body1">{data?.customer?.phone_number ?? '-'}</Typography>
        </Grid2>

        {/* Price */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Start Amount</Typography>
          <Typography variant="body1">{`${formatNumber(data?.start_amount)} AUD`}</Typography>
        </Grid2>
        {/* Discount Percentage */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Discount Percentage</Typography>
          <Typography variant="body1">{`${formatNumber(data?.discount_percentage)} %`}</Typography>
        </Grid2>

        {/* Discount Amount */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Discounted Amount</Typography>
          <Typography variant="body1">{`${formatNumber(data?.discount_amount)} AUD`}</Typography>
        </Grid2>

        {/* Tip Percentage */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Tip Percentage</Typography>
          <Typography variant="body1">{`${formatNumber(data?.tips_percentage)} %`}</Typography>
        </Grid2>

        {/* Tip Amount */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Tip Amount</Typography>
          <Typography variant="body1">{`${formatNumber(data?.tips_amount)} AUD`}</Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Final Amount</Typography>
          <Typography variant="body1">{`${formatNumber(data?.final_amount)} AUD`}</Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Commission Fee</Typography>
          <Typography variant="body1">
            {`${formatNumber(data?.commission_fee)} AUD`}

          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Payout Amount</Typography>
          <Typography variant="body1">
            {`${formatNumber(data?.final_amount - data?.commission_fee)} AUD`}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Commission Status</Typography>
          <Chip
            label={data?.commission_fee_status}
            sx={{ textTransform: 'capitalize' }}
            color={orderStatus[data?.commission_fee_status]}
            size="small"
          />
        </Grid2>

        {/* Registration Status */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Status</Typography>
          <Chip
            label={data?.status}
            sx={{ textTransform: 'capitalize' }}
            color={orderStatus[data?.status]}
            size="small"
          />
        </Grid2>

        {/* Refund Amount */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Refund Amount</Typography>
          <Typography variant="body1">{`${formatNumber(data?.refund_amount)} AUD`}</Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Service Type</Typography>
          <Typography variant="body1">
            {data?.service?.type === 'service' ? 'reading' : data?.service?.type}
          </Typography>
        </Grid2>

        {/* Light Worker Details */}
        {isAdmin && (
          <>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h6">Light Worker Name</Typography>
              <Typography variant="body1">
                {data?.light_worker_id?.first_name || data?.light_worker_id?.last_name
                  ? data?.light_worker_id?.first_name + ' ' + data?.light_worker_id?.last_name
                  : '-'}
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h6">Light Worker Phone Number</Typography>
              <Typography variant="body1">{data?.light_worker_id?.phone_number ?? '-'}</Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h6">Light Worker Business Name </Typography>
              <Typography variant="body1">{data?.light_worker_id?.business_name ?? '-'}</Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h6">Light Worker Country </Typography>
              <Typography variant="body1">{data?.light_worker_id?.country ?? '-'}</Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h6">Light Worker Abn </Typography>
              <Typography variant="body1">{data?.light_worker_id?.abn ?? '-'}</Typography>
            </Grid2>
          </>
        )}

        {/* Created At */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Created At</Typography>
          <Typography variant="body1">
            {/* {data?.created_at ? new Date(data?.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).replaceAll(" ", '-') : '-'} */}
            {dayjs(data?.created_at).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
          </Typography>
        </Grid2>

        {data?.type === 'subscription' && (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6">Day</Typography>
            <Typography variant="body1">{data?.booked_slot?.day ?? '-'}</Typography>
          </Grid2>
        )}

        {data?.type === 'one_time' && (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6">Booking Date</Typography>
            <Typography variant="body1">
              {dayjs(data?.booked_slot?.booking_date).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
            </Typography>
          </Grid2>
        )}

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6">Time Slots</Typography>
          <Typography variant="body1">
            {dayjs.unix(data?.booked_slot?.timeSlot?.start_time).format('h:mm A')} - {''}
            {dayjs.unix(data?.booked_slot?.timeSlot?.end_time).format('h:mm A')}
          </Typography>
        </Grid2>
      </Grid2>
    );
  };
  const renderStripeDetails = (data) => (
    <Grid2 container spacing={2}>
      {/* Name */}
      <pre>{JSON.stringify(stripeResponse, null, 3)}</pre>
    </Grid2>
  );
  return (
    <Stack gap={1}>
      <UICard heading={'Service Order Details'} backButton>
        {
          <ApiLoader h="auto" loading={isLoading}>
            {data && renderUserDetails(data)}
          </ApiLoader>
        }
      </UICard>
      <UICard heading={'Stripe Response'}>
        <ApiLoader h="auto" loading={isLoading}>
          {data && renderStripeDetails(data)}
        </ApiLoader>
      </UICard>
    </Stack>
  );
};

export default OrderDetailsPage;

let orderStatus = {
  delivered: 'success',
  completed: 'info',
  refunded: 'error',
  pending: 'warning',
  paid: 'success',
  unpaid: 'warning',
};

