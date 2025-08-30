'use client';

import GetUsersActions from './actions/get-user-actions';
import getColumnHeader from './column-header';
import useDataTable from '@/hooks/useDataTable';
import { UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { getUsers } from '@/store/admin/users/users.thunks';

const Page = () => {
  let { showDialog, addToast } = useToast();
  const { tableProps, fetching, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getUsers, // Your Redux asyncThunk or API function
    serverPagination: true,
    serverSearch: true,
    fetchWithDefaultParams: {
      role: 'customer',
    },
    initialExtraParams: {
      search: '',
    },
  });
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
      message: 'You want to delete this Customer? Please note that deleting this Customer will also remove all related data.',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };

  const columnHeader = getColumnHeader({ onDelete });

  return (
    <div>
      <UICard pageHeight heading={'Customers'}>
        <GetUsersActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading}
          tableColumns={columnHeader}
          {...tableProps}
        />
      </UICard>
    </div>
  );
};

export default Page;
