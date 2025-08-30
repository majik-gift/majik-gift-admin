'use client';

import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { getEvents } from '@/store/light-worker/events/events.thunk';
import { deleteProduct } from '@/store/products/products.thunk';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import InviteDialog from '../../light-worker/events/event-invites/[id]/invite-dialog';
import GetProductActions from './actions/get-product-actions';
import getEventsColumnHeader from './column-header';

const Events = () => {
  const { user } = useSelector((state) => state.auth);
  let { showDialog, addToast } = useToast();
  let isAdmin = user?.role === 'admin';
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);


  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getEvents,
    serverPagination: true,
    initialExtraParams: {
      // userId: [user?.id],
      registration_status: 'all',
      search: '',
    },
  });

  const [deleteProductApi, loading, error, data] = useApiRequest(deleteProduct, {
    initFetch: false,
  });

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      const res = await axiosInstance.delete(`events/${param}`);
      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
      fetchTableData();
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

  const onDelete = (id) => {
    console.log('🚀 ~ onDelete ~ id:', id);
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this Customer ',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };

  const handleCompleteEvent = (param) => async (closeHandler) => {
    try {
      const res = await axiosInstance.post(`events/marks-event-as-completed`, {
        id: param,
      });
      console.log('🚀 ~ handleCompleteEvent ~ res:', res);
      fetchTableData();
      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusLoading(true);
      await axiosInstance.patch(`events/${id}`, { status: newStatus });
      addToast({
        severity: 'success',
        message: `Group Activities status updated to ${newStatus}.`,
      });
      fetchTableData();
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        severity: 'error',
        message: 'Failed to update Group Activities status.',
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const onMarksAsComplete = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to complete the Group Activities',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(handleCompleteEvent(id));
  };

  let tableColumn = getEventsColumnHeader({
    onMarksAsComplete,
    onDelete,
    onStatusChange: handleStatusChange,
    user
  });

  return (
    <UICard
      pageHeight
      heading={'Group Activities'}
      action={
        <Link href={isAdmin ? `/admin/events/create` : `/light-worker/events/create`}>
          <UIButton>Create Group Activities</UIButton>
        </Link>
      }
    >
      <GetProductActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
      <UITable
        tableData={fetching?.list}
        loading={fetching?.loading}
        tableColumns={tableColumn}
        {...tableProps}
      />
      {openInviteDialog && (
        <InviteDialog
          handleDialogState={setOpenInviteDialog}
          open={openInviteDialog}
          id={currentId}
        />
      )}
    </UICard>
  );
};

export default Events;
