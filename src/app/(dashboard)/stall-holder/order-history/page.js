'use client';

import { useSelector } from 'react-redux';
import GetProductActions from './actions/get-product-actions';
import useDataTable from '@/hooks/useDataTable';
import { PaymentModal, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getOrders } from '@/store/admin/orders-history/orders-history.thunk';
import getOrderColumnHistory from './column-header';
import { useState } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';
import CustomDialog from '@/shared/components/ui/customeDialog';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);

  const [clientSecret, setClientSecret] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState({
    accept: false,
    reject: false
  })
  const { createPaymentIntent, confirmPayment, loading: stripeLoading } = usePaymentIntent();
  const { addToast } = useToast();
  const { tableProps, fetching, fetchTableData, extraParams, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getOrders,
    serverPagination: true,
    initialExtraParams: {
      stallHolderId: [user?.id],
      status: 'all',
      search: '',
      productId: null,
    },
  });


  const handleClickOpen = ({ payment_screenshot, id, row }) => {
    setOpen({ open: true, image: payment_screenshot, id, row });
  };

  const handleClose = () => {
    setOpen({ open: false });
  };

  const handleProductOrder = async (id, status) => {
    setLoading(prev => ({ ...prev, ...(status === 'accepted' ? { accept: true } : { reject: true }) }))
    try {
      let res = await axiosInstance.post(`orders/verify-product-order`, {
        ...id,
        status: status,
      });
      handleClose();
      fetchTableData();
      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
    } catch (error) {
      addToast({
        message: error?.response?.data?.message,
        severity: 'error',
      });
    } finally {
      setLoading({ accept: false, reject: false })
    }
  };
  const handleClientSecret = async (params) => {
    const data = await createPaymentIntent(
      'orders/commission-payment-intent',
      {
        order_id: params?.id
      }
    )
    setSelectedOrder(data)
    setClientSecret(data?.stripe_commission_intent_payment_intent_response?.client_secret)
    setOpenModal(true)
  }

  const handleConfirmPayment = async () => {
    await confirmPayment(
      'orders/confirm-commission-payment-intent',
      {
        order_id: selectedOrder?.id,
        success: true
      }

    )
    fetchTableData();
  }


  let { showDialog } = useToast();

  //   const onDelete = (id) => {
  //     showDialog({
  //       title: 'Are you Sure?',
  //       message: 'You want to delete this Product',
  //       actionText: 'Yes',
  //       showLoadingOnConfirm: true,
  //     }).then(deleteHandler(id));
  //   };

  let tableColumn = getOrderColumnHistory({ handleClientSecret, user, loading, handleClickOpen });

  return (
    <div>
      <UICard pageHeight heading={'Orders History'}>
        <GetProductActions fetchTableData={fetchTableData} extraParams={extraParams} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading || stripeLoading}
          tableColumns={tableColumn}
          {...tableProps}
        />
        <CustomDialog
          open={open}
          handleClose={handleClose}
          loading={loading}
          handleAccept={(id) => handleProductOrder(id, 'accepted')}
          handleReject={(id) => handleProductOrder(id, 'rejected')}
        />
        {clientSecret && <PaymentModal
          clientSecret={clientSecret}
          selectedOrder={selectedOrder}
          handleConfirm={handleConfirmPayment}
          open={openModal}
          handleClose={() => setOpenModal(false)}
        />}
      </UICard>
    </div>
  );
};

export default OrderHistory;
