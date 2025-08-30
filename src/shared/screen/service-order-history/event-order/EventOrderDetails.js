'use client';
import { useEffect, useState } from 'react';

import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Chip, Divider, Grid, Grid2, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import { getOrders, getSingleOrder } from '@/store/admin/orders-history/orders-history.thunk';
import { getSingleProduct, manageProductStatus } from '@/store/products/products.thunk';
import UITable from '@/shared/components/ui/table';
import useDataTable from '@/hooks/useDataTable';
import axiosInstance from '@/shared/services/axiosInstance';
import { formatNumber } from '@/hooks/formatNumber';
import getEventsColumnHeader from '@/app/(dashboard)/admin/events/column-header';
import getSingleOrderColumnHistory from '@/app/(dashboard)/admin/event-ticket-order-history/[orderId]/details/column-header';

const EventOrderDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const { orderId: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { singleOrder, singleOrderLoading, error } = useSelector((state) => state.order);
  const { addToast } = useToast();
  const getEventOrderDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`event-ticket-orders/${id}`);
      setRecords(data?.response?.details);
    } catch (error) {
      addToast({
        severiy: 'error',
        message: error?.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('records', records);
  }, [records]);

  let stripeResponse = {
    stripe_payment_intent_response: records?.stripe_payment_intent_response,
    stripe_success_payment_intent_response: records?.stripe_success_payment_intent_response,
    stripe_payment_refund_response: records?.stripe_payment_refund_response,
    stripe_success_payment_refund_response: records?.stripe_success_payment_refund_response,
    stripe_tip_payment_intent_response: records?.stripe_tip_payment_intent_response,
    stripe_tip_success_payment_intent_response: records?.stripe_tip_success_payment_intent_response,
    stripe_payment_tip_amount_transfer_response:
      records?.stripe_payment_tip_amount_transfer_response,
    stripe_payment_amount_transfer_response: records?.stripe_payment_amount_transfer_response,
  };

  const renderUserDetails = (data) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Order Id</Typography>
        <Typography variant="body1">{data?.id}</Typography>
      </Grid2>

      {/* Name */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Customer Name</Typography>
        <Typography variant="body1">
          {data?.customer?.first_name || data?.customer?.last_name
            ? `${data?.customer?.first_name} ${data?.customer?.last_name}`
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
        <Typography variant="body1">{`${formatNumber(data?.price)} AUD`}</Typography>
      </Grid2>

      {/* Discount Percent */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Discount Percentage</Typography>
        <Typography variant="body1">{`${formatNumber(data?.discount_percentage)} %`}</Typography>
      </Grid2>

      {/* Discount Amount */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Discount Amount</Typography>
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
        <Typography variant="body1">{`${formatNumber(data?.total_price)} AUD`}</Typography>
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
          {`${formatNumber(data?.total_price - data?.commission_fee)} AUD`}
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


      {/* Registration Status */}



      {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Event Name</Typography>
        <Typography variant="body1">
          {(data?.event?.first_name || data?.event?.last_name) ?
         `${data?.event?.first_name} ${data?.event?.last_name}`: '-'}
         </Typography>
      </Grid2> */}

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Group Activities Name</Typography>
        <Typography variant="body1">{data?.event?.title ?? '-'}</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Organizer Name</Typography>
        <Typography variant="body1">
          {data?.event?.organizer?.first_name || data?.event?.organizer?.last_name
            ? `${data?.event?.organizer?.first_name} ${data?.event?.organizer?.last_name}`
            : '-'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Organizer Phone Number</Typography>
        <Typography variant="body1">{data?.event?.organizer?.phone_number ?? '-'}</Typography>
      </Grid2>

      {/* Created At */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Created At</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).replaceAll(" " ,'-') || 'N/A'} */}
          {dayjs(data?.created_at).format(process.env.NEXT_PUBLIC_DATE_FORMAT) || '-'}
        </Typography>
      </Grid2>
    </Grid2>
  );

  const renderStripeDetails = (data) => (
    <Grid2 container spacing={2}>
      {/* Name */}
      <pre>{JSON.stringify(stripeResponse, null, 3)}</pre>
    </Grid2>
  );

  const tableColumn = getSingleOrderColumnHistory();

  useEffect(() => {
    getEventOrderDetails();
  }, []);

  return (
    <Stack gap={1}>
      <UICard heading={'Group Activities Order Details'} backButton>
        {
          <ApiLoader h="auto" loading={isLoading}>
            {records && renderUserDetails(records)}
          </ApiLoader>
        }
      </UICard>
      {records?.event?.invitations?.length > 0 && (
        <UICard heading={'Light Workers'}>
          <UITable
            tableData={records?.event?.invitations}
            loading={isLoading}
            tableColumns={tableColumn}
            height={'auto'}
          />
        </UICard>
      )}
      <UICard heading={'Stripe Response'}>
        <ApiLoader h="auto" loading={isLoading}>
          {records && renderStripeDetails(records)}
        </ApiLoader>
      </UICard>
    </Stack>
  );
};

export default EventOrderDetail;

let orderStatus = {
  delivered: 'success',
  completed: 'info',
  refunded: 'error',
  pending: 'warning',
  paid: 'success',
  unpaid: 'warning',
};
