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
import getSingleOrderColumnHistory from './column-header';
import useDataTable from '@/hooks/useDataTable';

const OrderDetailPage = () => {
  const { orderId: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { singleOrder, singleOrderLoading, error } = useSelector((state) => state.order);
  console.log('🚀 ~ OrderDetailPage ~ singleOrder:', singleOrder);
  const [openRejectionsDialog, setOpenRejectionsDialog] = useState(false);
  const { addToast } = useToast();

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getSingleOrder,
    serverPagination: true,
    fetchWithDefaultParams: {
      params: { id },
    },
  });

  let stripeResponse = {
    stripe_payment_intent_response: singleOrder?.stripe_payment_intent_response,
    stripe_success_payment_intent_response: singleOrder?.stripe_success_payment_intent_response,
    stripe_payment_refund_response: singleOrder?.stripe_payment_refund_response,
    stripe_success_payment_refund_response: singleOrder?.stripe_success_payment_refund_response,
    stripe_tip_payment_intent_response: singleOrder?.stripe_tip_payment_intent_response,
    stripe_tip_success_payment_intent_response:
      singleOrder?.stripe_tip_success_payment_intent_response,
    stripe_payment_tip_amount_transfer_response:
      singleOrder?.stripe_payment_tip_amount_transfer_response,
    stripe_payment_amount_transfer_response: singleOrder?.stripe_payment_amount_transfer_response,
  };

  // const handleUserStatus = async () => {
  //   try {
  //     const { payload } = await dispatch(
  //       manageProductStatus({ params: { id }, payload: { registrationStatus: 'approved' } })
  //     );
  //     if (payload) {
  //       addToast({
  //         message: payload.message,
  //         severity: 'success',
  //       });
  //       router.push('/admin/products');
  //     }
  //   } catch (error) {
  //     console.error('Error approving user:', error);
  //   }
  // };

  const renderUserDetails = (data) => (
    <Grid2 container spacing={2}>
      {/* Name */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Customer Name</Typography>
        <Typography variant="body1">
          {data?.customer?.first_name + ' ' + data?.customer?.last_name}
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

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Final Amount</Typography>
        <Typography variant="body1">{`${data?.final_amount} AUD` ?? '-'}</Typography>
      </Grid2>

      {/* Tip Amount */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Tip Amount</Typography>
        <Typography variant="body1">{`${data?.tips_amount} AUD`}</Typography>
      </Grid2>

      {/* Price */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Start Amount</Typography>
        <Typography variant="body1">{`${data?.start_amount} AUD` ?? '-'}</Typography>
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

      {/* Shipping Detail  */}

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping Country </Typography>
        <Typography variant="body1">{data?.shipping_country ?? '_'}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping State </Typography>
        <Typography variant="body1">{data?.shipping_state ?? '_'}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping City </Typography>
        <Typography variant="body1">{data?.shipping_city ?? '_'}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping Address</Typography>
        <Typography variant="body1">{data?.shipping_address ?? '_'}</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping Postal Code</Typography>
        <Typography variant="body1">{data?.shipping_postal_code ?? '_'}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Shipping Cost </Typography>
        <Typography variant="body1">{`${data?.shipping_cost} AUD`}</Typography>
      </Grid2>

      {/* Stall Holder Details */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Stall Holder Name</Typography>
        <Typography variant="body1">
          {data?.stall_holder_id?.first_name + ' ' + data?.stall_holder_id?.last_name ?? '-'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Stall Holder Phone Number</Typography>
        <Typography variant="body1">{data?.stall_holder_id?.phone_number ?? '-'}</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Stall Holder Business Name </Typography>
        <Typography variant="body1">{data?.stall_holder_id?.business_name ?? '-'}</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Stall Holder Country </Typography>
        <Typography variant="body1">{data?.stall_holder_id?.country ?? '-'}</Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Stall Holder Abn </Typography>
        <Typography variant="body1">{data?.stall_holder_id?.abn ?? '-'}</Typography>
      </Grid2>

      {/* Created At */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6">Created At</Typography>
        <Typography variant="body1">
          {/* {new Date(data?.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).replaceAll(" " ,'-')|| 'N/A'} */}
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

  let tableColumn = getSingleOrderColumnHistory();

  return (
    <Stack gap={1}>
      <UICard heading={'Order Details'} backButton>
        {
          <ApiLoader h="auto" loading={singleOrderLoading}>
            {singleOrder && renderUserDetails(singleOrder)}
          </ApiLoader>
        }
      </UICard>
      <UICard heading={'Order Items'}>
        <UITable
          tableData={fetching.list?.order_items}
          loading={fetching.loading}
          tableColumns={tableColumn}
          {...tableProps}
          height={'auto'}
        />
      </UICard>
      <UICard heading={'Stripe Response'}>
        <ApiLoader h="auto" loading={singleOrderLoading}>
          {singleOrder && renderStripeDetails(singleOrder)}
        </ApiLoader>
      </UICard>
    </Stack>
  );
};

export default OrderDetailPage;

let orderStatus = {
  delivered: 'success',
  completed: 'info',
  refunded: 'error',
  pending: 'warning',
};
