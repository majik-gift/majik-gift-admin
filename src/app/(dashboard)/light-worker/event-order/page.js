'use client';

import { useSelector } from 'react-redux';

import useDataTable from '@/hooks/useDataTable';
import { UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getServiceOrdersHistoryById } from '@/store/services/services.thunk';
import getOrderColumnHistory from './column-header';
import eventApi from '@/apis/event/event.api';

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: eventApi.getOrdersHistoryById,
    serverPagination: true,
    initialExtraParams: {
      params: { id: user?.id },
    },
  });



  let { showDialog } = useToast();

  //   const onDelete = (id) => {
  //     showDialog({
  //       title: 'Are you Sure?',
  //       message: 'You want to delete this Product',
  //       actionText: 'Yes',
  //       showLoadingOnConfirm: true,
  //     }).then(deleteHandler(id));
  //   };

  let tableColumn = getOrderColumnHistory();

  return (
    <div>
      <UICard pageHeight heading={'Event Orders'}>
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

export default OrderHistory;
