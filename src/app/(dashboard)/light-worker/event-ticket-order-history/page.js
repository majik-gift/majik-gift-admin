'use client';
import { PaymentModal, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import GetProductActions from './actions/get-product-actions';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';
import { useToast } from '@/shared/context/ToastContext';
import getOrderColumnHistory from './column-header';
import CustomDialog from '@/shared/components/ui/customeDialog';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState({
    accept: false,
    reject: false
  })
  const [extraParams, setExtraParams] = useState({
    eventId: null,
  });
  const { addToast } = useToast();
  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 20,
    rowCount: 0,
  });
  const { createPaymentIntent, confirmPayment, loading: stripeLoading } = usePaymentIntent();

  const handleClickOpen = ({ payment_screenshot, id, row }) => {
    setOpen({ open: true, image: payment_screenshot, id, row });
  };



  const handleClientSecret = async (params) => {
    if (!extraParams?.eventId) {
      addToast({
        message: 'Please event to pay commission',
        severity: 'error',
      });
      return
    }
    const data = await createPaymentIntent(
      'event-ticket-orders/all-commission-payment-intent',
      {
        event_id: extraParams?.eventId?.value
      }
    )
    setSelectedOrder(data)
    setClientSecret(data?.stripe_commission_intent_payment_intent_response?.client_secret)
    setOpenModal(true)
  }

  const handleConfirmPayment = async () => {
    await confirmPayment(
      'event-ticket-orders/all-confirm-commission-payment-intent',
      {
        event_id: extraParams?.eventId?.value,
        success: true
      }

    )
    getServiceOrderHistory();
  }

  let tableColumn = getOrderColumnHistory({ handleClickOpen, handleClientSecret, user });

  const getServiceOrderHistory = async () => {

    let url = `event-ticket-orders?page=${pagination.page + 1}&perPage=${pagination.perPage}`;
    if (extraParams.status) url += `&status=${extraParams.status}`;
    if (extraParams.search) url += `&search=${extraParams.search}`;
    if (extraParams.eventId) url += `&eventId=${extraParams.eventId.value}`;

    // if (!isAdmin) {
    //   url = `event-ticket-orders?organizer_id[]=${user?.id}&page=${pagination.page + 1}&perPage=${pagination.perPage}`;
    // }
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

  const handleEventOrder = async (id, status) => {
    setLoading(prev => ({ ...prev, ...(status === 'accepted' ? { accept: true } : { reject: true }) }))
    try {
      let res = await axiosInstance.post(`event-ticket-orders/verify-event-ticket-order`, {
        ...id,
        status: status,
      });
      handleClose();
      getServiceOrderHistory();
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

  const handleClose = () => {
    setOpen({ open: false });
  };


  useEffect(() => {
    if (user) {
      getServiceOrderHistory();
    }
  }, [user, pagination, extraParams]);

  return (
    <div>
      <UICard pageHeight heading={'Group Activities Orders'}>
        <GetProductActions
          fetchTableData={getServiceOrderHistory}
          extraParams={extraParams}
          setExtraParams={setExtraParams}
          records={records}
          handleClientSecret={handleClientSecret}
          loading={stripeLoading}
        />
        <UITable
          tableData={records?.details}
          loading={isLoading}
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
          loading={loading}
          open={open}
          handleClose={handleClose}
          handleAccept={(id) => handleEventOrder(id, 'accepted')}
          handleReject={(id) => handleEventOrder(id, 'rejected')}
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
