'use client';

import { useSelector } from 'react-redux';
import eventApi from '@/apis/event/event.api';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import getOrderColumnHistory from './column-header';
import GetProductActions from './actions/get-product-actions';
import { useState } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';
import CustomDialog from '@/shared/components/ui/customeDialog';

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loading, setLoading] = useState({
    accept: false,
    reject: false
  })
  const [open, setOpen] = useState()
  const { addToast } = useToast();

  const { tableProps, fetching, fetchTableData, extraParams, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: eventApi.getOrdersHistory,
    serverPagination: true,
    initialExtraParams: {
      status: 'all',
      search: '',
      organizer_id: null,
      eventId: null
    },
  });

  const handleClickOpen = ({ payment_screenshot, id, row }) => {
    setOpen({ open: true, image: payment_screenshot, id, row });
  };

  const handleClose = () => {
    setOpen({ open: false });
  };

  let tableColumn = getOrderColumnHistory({ handleClickOpen });
  const downloadCsv = async () => {
    setLoadingCsv(true);
    try {
      const response = await axiosInstance.get(`auth/report/download`, {
        params: {
          particular: 'event_ticket_orders',
          status: extraParams.status,
          search: extraParams.search,
          organizer_id: extraParams.organizer_id,
        },
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'event_ticket_orders.csv';
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


  const handleEventOrder = async (id, status) => {
    setLoading(prev => ({ ...prev, ...(status === 'accepted' ? { accept: true } : { reject: true }) }))
    try {
      let res = await axiosInstance.post(`event-ticket-orders/verify-event-ticket-order`, {
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

  return (
    <div>
      <UICard pageHeight heading={'Group Activities Orders'}
        action={
          <UIButton onClick={downloadCsv} disabled={loadingCsv}>
            Download CSV
          </UIButton>
        }
      >
        <GetProductActions fetchTableData={fetchTableData} extraParams={extraParams} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading}
          tableColumns={tableColumn}
          {...tableProps}
        />
      </UICard>
      <CustomDialog
        loading={loading}
        open={open}
        handleClose={handleClose}
        handleAccept={(id) => handleEventOrder(id, 'accepted')}
        handleReject={(id) => handleEventOrder(id, 'rejected')}
      />
    </div>
  );
};

export default OrderHistory;
