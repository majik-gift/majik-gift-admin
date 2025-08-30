'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';

import GetProductActions from './actions/get-product-actions';
import getCategoriesColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { categoriesGet, deleteCategory } from '@/store/admin/categories/categories.thunk';
import axiosInstance from '@/shared/services/axiosInstance';

const Categories = () => {
  const { user } = useSelector((state) => state.auth);
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: categoriesGet,
    serverPagination: true,
    initialExtraParams: {
      type: 'all',
      search: '',
    },
  });

  let { showDialog, addToast } = useToast();

  const [deleteCategoryApi, loading, error, data] = useApiRequest(deleteCategory, {
    initFetch: false,
  });

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      let response = await deleteCategoryApi({ params: { id: param?.id } });
      deleteRowHandler(param?.id);
      fetchTableData();
      addToast({ message: response?.message, severity: 'success' });
    } catch (error) {
      console.log('🚀 ~ deleteHandler ~ error:', error);
      addToast({ message: error?.message, severity: 'error' });
    } finally {
      closeHandler();
    }
  };

  const onDelete = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this Category',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };

  let tableColumn = getCategoriesColumnHeader({ onDelete });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Categories'}
        action={
          <Link href={'/admin/categories/create'}>
            <UIButton>Create Category</UIButton>
          </Link>
        }
      >
        <GetProductActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list ? [...fetching.list].reverse() : []}
          loading={fetching.loading}
          tableColumns={tableColumn}
          {...tableProps}
        />
      </UICard>
    </div>
  );
};

export default Categories;
