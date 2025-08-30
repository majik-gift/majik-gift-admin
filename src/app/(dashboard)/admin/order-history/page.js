'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import GetProductActions from './actions/get-product-actions';
import getOrderColumnHistory from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getOrders } from '@/store/admin/orders-history/orders-history.thunk';
import axiosInstance from '@/shared/services/axiosInstance';
import { useEffect, useState } from 'react';
import CustomDialog from '@/shared/components/ui/customeDialog';

const OrderHistory = () => {
  const [open, setOpen] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler, extraParams } =
    useDataTable({
      tableApi: getOrders,
      serverPagination: true,
      initialExtraParams: {
        status: 'all',
        search: '',
        stallHolderId: null,
        productId: null,
      },
    });

  const downloadCsv = async () => {
    setLoadingCsv(true);
    try {
      const response = await axiosInstance.get(`auth/report/download`, {
        params: {
          particular: 'orders',
          status: extraParams.status,
          search: extraParams.search,
          stallHolderId: extraParams.stallHolderId,
        },
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'orders.csv';
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

  const handleAcceptProductOrder = async (id) => {
    try {
      let res = await axiosInstance.post(`orders/verify-product-order`, {
        ...id,
        status: 'accepted',
      });
      handleClose();
      // getServiceOrderHistory();
      console.log('🚀 ~ handleRejectServiceOrder ~ res:', res);
    } catch (error) {
      // showErrorNotification('Failed to complete the service order.');
    }
  };

  const handleRejectProductOrder = async (id) => {
    try {
      let res = await axiosInstance.post(`orders/verify-product-order`, {
        ...id,
        status: 'rejected',
      });
      handleClose();
      getServiceOrderHistory();
    } catch (error) {
      console.log('🚀 ~ handleRejectServiceOrder ~ error:', error);
    }
  };

  const handleClickOpen = ({ payment_screenshot, id, row }) => {
    setOpen({ open: true, image: payment_screenshot, id, row });
  };

  const handleClose = () => {
    setOpen({ open: false });
  };

  let tableColumn = getOrderColumnHistory({ handleClickOpen });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Product Order'}
        action={
          <UIButton onClick={downloadCsv} disabled={loadingCsv}>
            Download CSV
          </UIButton>
        }
        isLoading={loadingCsv}
      >
        <GetProductActions
          fetchTableData={fetchTableData}
          extraParams={extraParams}
          setExtraParams={setExtraParams}
        />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading}
          tableColumns={tableColumn}
          {...tableProps}
        />
      </UICard>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        handleAccept={handleAcceptProductOrder}
        handleReject={handleRejectProductOrder}
      />
    </div>
  );
};

export default OrderHistory;
