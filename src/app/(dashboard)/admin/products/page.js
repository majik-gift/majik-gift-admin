'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useToast } from '@/shared/context/ToastContext';
import GetProductActions from './actions/get-product-actions';
import getProductsColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { deleteProduct, getProducts } from '@/store/products/products.thunk';
import axiosInstance from '@/shared/services/axiosInstance';

const Products = () => {
  let {showDialog, addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getProducts, // Your Redux asyncThunk or API function
    serverPagination: true,
    initialExtraParams: {
      registration_status: 'all',
      search: '',
    },
  });

  const [deleteProductApi, loading, error, data] = useApiRequest(deleteProduct, {
    initFetch: false,
  });

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      await deleteProductApi({ params: { id: param?.id } });
      deleteRowHandler(param?.id);
      addToast({
        severity: 'success',
        message: `Product deleted successfully.`,
      });
    } catch (error) {
      console.log('🚀 ~ deleteHandler ~ error:', error);
    } finally {
      closeHandler();
    }
  };

  const onDelete = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this Product',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`products/${id}`, { status: newStatus });
      fetchTableData()
      addToast({
        severity: 'success',
        message: `Product status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        severity: 'error',
        message: 'Failed to update Product status.',
      });
    }  
  };

  let tableColumn = getProductsColumnHeader({ onDelete, onStatusChange : handleStatusChange });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Products'}
        action={
          <Link href={!isStripeConnect ? `/admin/products/create` : '/admin/connect-stripe'}>
            <UIButton>Create Product</UIButton>
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
      </UICard>
    </div>
  );
};

export default Products;
