'use client';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import getCouponColumnHeader from './column-header';
import InviteDialog from './invite-dialog';
// import CreateActivityDialog from './create-activity-dialog';

const GetAllInvites = ({ createRoute = `/admin/coupons/create` }) => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 20,
    rowCount: 0,
  });

  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const url = `events/get-event-invitations?id=${Number(id)}&page=${pagination.page + 1}&perPage=${pagination.perPage}`;

      const response = await axiosInstance.get(url);
      setRecords(response.data.response); // Assuming the API returns a `data.items` structure
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error?.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('🚀 ~ GetAllActivities ~ records:', records);

  useEffect(() => {
    getAllActivities();
  }, [pagination]);

  const deleteHandler = (param) => async (closeHandler) => {
    try {
      await axiosInstance.delete(`events/delete-invitation/${param}`);
      getAllActivities();
    } catch (error) {
      console.log('🚀 ~ deleteHandler ~ error:', error);
    } finally {
      closeHandler();
    }
  };

  const onDelete = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete the invite',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteHandler(id));
  };

  let tableColumn = getCouponColumnHeader({
    onDelete,
  });

  const onInvite = (id) => {
    setCurrentId(id);
    setOpenInviteDialog(true);
  };

  return (
    <div>
      <UICard
        pageHeight
        backButton
        heading="Light Worker Invitations"
        action={<UIButton onClick={() => onInvite(id)}>Invite Light Workers</UIButton>}
      >
        <ApiLoader loading={isLoading} error={error}>
          <UITable
            tableData={records?.details}
            loading={isLoading}
            tableColumns={tableColumn}
            paginationModel={{
              pageSize: pagination?.perPage,
              page: pagination?.page,
            }}
            paginationMode="server"
            onPaginationModelChange={({ pageSize, page }) => {
              setPagination({ page, perPage: pageSize });
            }}
            rowCount={records?.totalItems}
            // {...tableProps}
          />
        </ApiLoader>
      </UICard>

      {openInviteDialog && (
        <InviteDialog
          handleDialogState={setOpenInviteDialog}
          open={openInviteDialog}
          id={currentId}
          getData={getAllActivities}
        />
      )}
    </div>
  );
};

export default GetAllInvites;
