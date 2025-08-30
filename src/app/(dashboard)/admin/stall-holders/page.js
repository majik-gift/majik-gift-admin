'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useDispatch } from 'react-redux';

import GetUsersActions from './actions/get-user-actions';
import getColumnHeader from './column-header';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getUsers } from '@/store/admin/users/users.thunks';
import { updateLightWorker } from '@/store/light-worker/add-update/lightWoker.thunk';
import axiosInstance from '@/shared/services/axiosInstance';

const Page = () => {
  const dispatch = useDispatch();

  const { tableProps, fetching, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getUsers, // Your Redux asyncThunk or API function
    serverPagination: true,
    serverSearch: true,
    fetchWithDefaultParams: {
      role: 'stall_holder',
    },
    initialExtraParams: {
      registration_status: '',
      search: '',
    },
  });
  const { addToast,showDialog } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleStatusChange = async (id, newStatus) => {
    try {
      const payload = {
        status: newStatus,
      };
      setIsLoading(true);
      let res =  await dispatch(updateLightWorker({ params: { id }, payload })).unwrap();
      addToast({
        severity: 'success',
        message: `${res.message}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        severity: 'error',
        message: 'Failed to update Stoll holder status.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteHandler = (param) => async (closeHandler) => {
    try {
      const res = await axiosInstance.delete(`users/${param}`);
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
      message: 'You want to delete this Stall Holder? Please note that deleting this Stall Holder will also remove all related data.',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };
  const columnHeader = getColumnHeader({ onStatusChange: handleStatusChange,onDelete });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Stall holders'}
        action={
          <Link href={`/admin/stall-holders/create`}>
            <UIButton>Add Stall Holder</UIButton>
          </Link>
        }
      >
        <GetUsersActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading || isLoading}
          tableColumns={columnHeader}
          {...tableProps}
        />
      </UICard>
    </div>
  );
};

export default Page;
