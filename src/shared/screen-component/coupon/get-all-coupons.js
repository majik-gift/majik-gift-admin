'use client';

import { ApiLoader, UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import getCouponColumnHeader from './column-header';
import { useSelector } from 'react-redux';
// import CreateActivityDialog from './create-activity-dialog';

const GetAllCoupons = ({ createRoute = `/admin/coupons/create` }) => {
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

  const { serviceId, eventId } = useParams(); // Get the service ID from URL params

  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const url = `coupons?page=${pagination.page + 1}&perPage=${pagination.perPage}`;

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
  const  onDelete = async (id) => {
    console.log("🚀 ~ onDelete ~ id:", id)
    try {
      await axiosInstance.delete(`coupons/${id}`)
      getAllActivities()
    } catch (error) {
      console.log("🚀 ~ onDelete ~ error:", error)
      
    }
  };
  let tableColumn = getCouponColumnHeader({ user, onDelete });
  return (
    <div>
      <UICard
        pageHeight
        backButton
        heading="Coupons"
        action={
          <UIButton component={Link} href={createRoute}>
            Create Coupon
          </UIButton>
        }
      >
        <ApiLoader loading={isLoading} error={error}>
          <UITable
            tableData={records?.details}
            loading={isLoading}
            tableColumns={tableColumn}
            paginationModel={{
              pageSize: pagination.perPage,
              page: pagination.page,
            }}
            paginationMode="server"
            onPaginationModelChange={({ pageSize, page }) => {
              setPagination({ page, perPage: pageSize });
            }}
            rowCount={records.totalItems}
            // {...tableProps}
          />
        </ApiLoader>
      </UICard>

      {/* <CreateActivityDialog
        openCreateActivityModal={openModal}
        setOpenCreateActivityModal={setOpenModal}
        getData={getAllActivities}
      /> */}
    </div>
  );
};

export default GetAllCoupons;
