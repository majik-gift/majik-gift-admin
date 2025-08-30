'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import GetProductActions from './actions/get-product-actions';
import getProductsColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { deleteProduct, getProducts } from '@/store/products/products.thunk';

const Products = () => {
  const { user } = useSelector((state) => state.auth);
  let { showDialog } = useToast();

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getProducts,
    serverPagination: true,
    initialExtraParams: {
      userId: [user?.id],
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

  let tableColumn = getProductsColumnHeader({ onDelete });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Products'}
        action={
          <Link href={`/stall-holder/products/create`}>
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
