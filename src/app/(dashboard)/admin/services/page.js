'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import GetProductActions from './actions/get-product-actions';
import getServicesColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { deleteServices, getServices } from '@/store/services/services.thunk';
import axiosInstance from '@/shared/services/axiosInstance';
import { useState } from 'react';

const Services = () => {
  const { showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, deleteRowHandler, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getServices, // Your Redux asyncThunk or API function
    serverPagination: true,
    initialExtraParams: {
      registration_status: 'all',
      search: '',
      service: [],
    },
  });

  const [deleteServiceApi, loading, error, data] = useApiRequest(deleteServices, {
    initFetch: false,
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      setIsLoading(true);
      await axiosInstance.patch(`service/${id}`, { status: newStatus });
      addToast({
        severity: 'success',
        message: `Service status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        severity: 'error',
        message: 'Failed to update service status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = (id) => async (closeHandler) => {
    try {
      await deleteServiceApi({ params: { id } });
      deleteRowHandler(id);
    } catch (error) {
      console.log('🚀 ~ deleteSeasfasfasfsrvice ~ error:', error);
    } finally {
      closeHandler();
    }
  };

  const deleteHandler = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this service',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteService(id));
  };

  const tableHeaders = getServicesColumnHeader({
    deleteHandler,
    onStatusChange: handleStatusChange,
    user,
  });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Services'}
        action={
          <UIButton
            component={Link}
            href={!isStripeConnect ? '/admin/services/create' : '/admin/connect-stripe'}
          >
            Create Service
          </UIButton>
        }
      >
        <GetProductActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading || isLoading}
          tableColumns={tableHeaders}
          {...tableProps}
        />
      </UICard>
    </div>
  );
};

export default Services;
