'use client';

import { useSelector } from 'react-redux';

import GetReviewsActions from './actions/get-reviews-actions';
import getReviewsColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { reviewsGet, deleteReview } from '@/store/admin/reviews/reviews.thunk';

const Reviews = () => {
  const { user } = useSelector((state) => state.auth);

  const { tableProps, fetching, fetchTableData, setExtraParams, deleteRowHandler } = useDataTable({
    tableApi: reviewsGet,
    serverPagination: true,
    initialExtraParams: {
      search: '',
    },
  });

  let { showDialog, addToast } = useToast();

  const [deleteReviewApi, loading, error, data] = useApiRequest(deleteReview, {
    initFetch: false,
  });

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      let response = await deleteReviewApi({ params: { id: param?.id } });
      deleteRowHandler(param?.id);
      fetchTableData();
      addToast({ message: response?.message || 'Review deleted successfully', severity: 'success' });
    } catch (error) {
      console.log('🚀 ~ deleteHandler ~ error:', error);
      addToast({ message: error?.message || 'Failed to delete review', severity: 'error' });
    } finally {
      closeHandler();
    }
  };

  const onDelete = (review) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this review',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(review));
  };

  let tableColumn = getReviewsColumnHeader({ onDelete });

  return (
    <div>
      <UICard
        pageHeight
        heading={'Reviews'}
      >
        <GetReviewsActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
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

export default Reviews;

