'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import GetProductActions from './actions/get-product-actions';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getEvents } from '@/store/light-worker/events/events.thunk';
import { deleteProduct } from '@/store/products/products.thunk';
import getEventsColumnHeader from './column-header';
import axiosInstance from '@/shared/services/axiosInstance';
import { add } from 'lodash';

const Events = () => {
  const { user } = useSelector((state) => state.auth);
  let { showDialog, addToast } = useToast();
  let isAdmin = user?.role === 'admin';

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getEvents,
    serverPagination: true,
    initialExtraParams: {
      userId: [user?.id],
      registration_status: 'all',
      search: '',
    },
  });

  const [deleteProductApi, loading, error, , , , data] = useApiRequest(deleteProduct, {
    initFetch: false,
  });

  const handleCompleteEvent = (param) => async (closeHandler) => {
    try {
      const res = await axiosInstance.post(`events/marks-event-as-completed`, {
        id: param,
      });
      addToast({
        message: res?.data?.message,
        severity: 'success',
      });
      fetchTableData();
    } catch (error) {
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
      message: 'You want to complete the Group Activities',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(handleCompleteEvent(id));
  };

  let tableColumn = getEventsColumnHeader({ onMarksAsComplete, user });
  return (
    <div>
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
          tableData={fetching.list}
          loading={fetching.loading}
          tableColumns={tableColumn}
          {...tableProps}
        />
        {/* {openInviteDialog && (
          <InviteDialog
            handleDialogState={setOpenInviteDialog}
            open={openInviteDialog}
            id={currentId}
          />
        )} */}
      </UICard>
    </div>
  );
};

export default Events;
