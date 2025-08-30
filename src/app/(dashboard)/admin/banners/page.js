'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';

import getBannersColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { deleteBanner, getBanners } from '@/store/admin/banners/banners.thunk';

const Banners = () => {
  const { user } = useSelector((state) => state.auth);
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: getBanners, // Your Redux asyncThunk or API function
    serverPagination: true,
  });

  let { showDialog } = useToast();

  const [delBanner, loading, error, data] = useApiRequest(deleteBanner, {
    initFetch: false,
  });

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      await delBanner({ params: { id: param?.id } });
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

  let tableColumn = getBannersColumnHeader({ onDelete });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Banners'}
        action={
          <Link href={'/admin/banners/create'}>
            <UIButton>Create Banner</UIButton>
          </Link>
        }
      >
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

export default Banners;
