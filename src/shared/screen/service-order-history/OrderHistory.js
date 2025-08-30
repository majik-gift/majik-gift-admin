'use client';
import useDataTable from '@/hooks/useDataTable';
import { CheckoutForm, PaymentModal, UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import {
  getServiceOrdersHistory,
  getWorkerOrderHistory,
} from '@/store/admin/service/service-orders-history.thunk';
import { useSelector } from 'react-redux';
import axiosInstance from '../../services/axiosInstance';
import getOrderColumnHistory from '@/app/(dashboard)/admin/service-order-history/column-header';
import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import GetProductActions from '@/app/(dashboard)/admin/service-order-history/actions/get-product-actions';
import CustomDialog from '@/shared/components/ui/customeDialog';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';
import { DialogContent, Modal, Typography } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const OrderHistory = () => {
  const [open, setOpen] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [extraParams, setExtraParams] = useState({
    lightWorkerId: null,
    serviceId: null,
  });
  const [loadingCsv, setLoadingCsv] = useState(false);
  const { addToast, showDialog } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const isAdmin = user?.role === 'admin';
  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 20,
    rowCount: 0,
  });
  const { createPaymentIntent, confirmPayment, loading } = usePaymentIntent();

  const getServiceOrderHistory = async () => {
    let url = `service-orders?page=${pagination.page + 1}&perPage=${pagination.perPage}`;
    if (extraParams.status) url += `&status=${extraParams.status}`;
    if (extraParams.search) url += `&search=${extraParams.search}`;
    if (extraParams.serviceId) url += `&serviceId=${extraParams.serviceId.value}`;
    if (extraParams.lightWorkerId) url += `&lightWorkerId=${extraParams.lightWorkerId.value}`;
    if (!isAdmin) url += `&lightWorkerId[]=${user?.id}`;
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(url);
      setRecords(data?.response);
    } catch (error) {
      addToast({
        message: error?.response?.data?.message,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteServiceOrder = (param) => async (closeHandler) => {
    try {
      const res = await axiosInstance.post(`service-orders/marks-service-order-as-completed`, {
        id: param,
      });
      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
      getServiceOrderHistory();
    } catch (error) {
      console.log('🚀 ~ deleteHandler ~ error:', error);
      addToast({
        message: error?.message,
        severity: 'error',
      });
    } finally {
      closeHandler();
    }
  };

  const onMarksAsComplete = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to complete the service order',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(handleCompleteServiceOrder(id));
  };

  const handleAcceptServiceOrder = async (id) => {
    try {
      let res = await axiosInstance.post(`service-orders/verify-service-order`, {
        ...id,
        status: 'accepted',
      });
      handleClose();
      getServiceOrderHistory();
      console.log('🚀 ~ handleRejectServiceOrder ~ res:', res);
    } catch (error) {
      // showErrorNotification('Failed to complete the service order.');
    }
  };

  const handleRejectServiceOrder = async (id) => {
    try {
      let res = await axiosInstance.post(`service-orders/verify-service-order`, {
        ...id,
        status: 'rejected',
      });
      handleClose();
      getServiceOrderHistory();
      console.log('🚀 ~ handleRejectServiceOrder ~ res:', res);
    } catch (error) {
      console.log('🚀 ~ handleRejectServiceOrder ~ error:', error);
    }
  };

  const handleClientSecret = async (params) => {
    const data = await createPaymentIntent('service-orders/commission-payment-intent', {
      service_order_id: params?.id,
    });
    setSelectedOrder(data);
    setClientSecret(data?.stripe_commission_intent_payment_intent_response?.client_secret);
    setOpenModal(true);
  };

  const downloadReceipt = async (url) => {
    try {
      const resp = await fetch(
        'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUUI5Z29JSVE5Ykh1cHNnKKuK8MIGMgYc6rTPhp86LBYoBcQ1A_SskpO2CSzk9suG0buDNm2fKT9hLUOFSvuLbIPxZk8gm5B_3k1E'
      );
      const blob = await resp.blob();
      const href = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = href;
      a.download = `receipt-invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleConfirmPayment = async () => {
    await confirmPayment('service-orders/confirm-commission-payment-intent', {
      service_order_id: selectedOrder?.id,
      success: true,
    });
    getServiceOrderHistory();
  };

  const handleClickOpen = ({ payment_screenshot, id, row }) => {
    setOpen({ open: true, image: payment_screenshot, id, row });
  };

  const handleClose = () => {
    setOpen({ open: false });
  };

  let tableColumn = getOrderColumnHistory({
    onMarksAsComplete,
    handleClientSecret,
    user,
    handleClickOpen,
    downloadReceipt,
  });

  useEffect(() => {
    if (user) {
      getServiceOrderHistory();
    }
  }, [user, pagination, extraParams]);

  const downloadCsv = async () => {
    setLoadingCsv(true);
    try {
      const response = await axiosInstance.get(`auth/report/download`, {
        params: {
          particular: 'service_orders',
          status: extraParams.status,
          search: extraParams.search,
          serviceId: extraParams.serviceId,
        },
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'service_orders.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('🚀 ~ downloadCsv ~ error:', error);
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <div>
      <UICard
        pageHeight
        heading={'Service Orders'}
        action={
          <UIButton onClick={downloadCsv} disabled={loadingCsv}>
            Download CSV
          </UIButton>
        }
      >
        <GetProductActions
          // fetchTableData={getServiceOrderHistory}
          extraParams={extraParams}
          setExtraParams={setExtraParams}
        />
        <UITable
          tableData={records?.details}
          loading={isLoading || loading}
          tableColumns={tableColumn}
          paginationModel={{
            pageSize: pagination.perPage,
            page: pagination.page,
          }}
          rowCount={records.totalItems}
          paginationMode="server"
          onPaginationModelChange={({ pageSize, page }) => {
            setPagination({ page, perPage: pageSize });
          }}
        />
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleAcceptServiceOrder}
          handleReject={handleRejectServiceOrder}
        />

        {clientSecret && (
          <PaymentModal
            clientSecret={clientSecret}
            selectedOrder={selectedOrder}
            handleConfirm={handleConfirmPayment}
            open={openModal}
            handleClose={() => setOpenModal(false)}
          />
        )}
      </UICard>
    </div>
  );
};

export default OrderHistory;
