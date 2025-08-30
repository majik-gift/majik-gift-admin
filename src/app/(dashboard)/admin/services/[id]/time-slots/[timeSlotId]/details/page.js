'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getTimeSlots } from '@/store/services/services.thunk';
import axiosInstance from '@/shared/services/axiosInstance';
import { useEffect, useState } from 'react';
import { getTimeSlotColumnHeader } from './column-header';
import CreateMessageDialog from '@/shared/services/time-slots/activity/create-message-modal';

const ScheduledTimeSlots = ({ params }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, deleteRowHandler, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getTimeSlots, // Your Redux asyncThunk or API function
    serverPagination: true,
    initialExtraParams: {
      id: params?.id,
      day: 'monday',
    },
  });

  const getScheduledOrders = async () => {
    try {
      setIsLoading(true);
      const url = `time-slot/${params?.timeSlotId}`;
      const { data } = await axiosInstance.get(url);
      const response = data?.response?.details;
      const booked_slots = data?.response?.details?.booked_slots?.map((slot) => ({
        ...slot,
        start_time: response?.start_time,
        end_time: response?.end_time,
        service: response?.service?.title,
        day: response?.day,
      }));
      setRecords(booked_slots);
    } catch (error) {
      addToast({
        severity: 'error',
        message: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getScheduledOrders();
  }, []);


  const tableHeaders = getTimeSlotColumnHeader(records);

  return (
    <div>
      <UICard
        pageHeight
        backButton
        heading={'Scheduled Orders'}
        action={<UIButton onClick={() => setOpenModal(true)}>Send Message</UIButton>}
      >
        <UITable
          tableData={records}
          loading={isLoading}
          tableColumns={tableHeaders}
          {...tableProps}
        />

        {openModal && (
          <CreateMessageDialog
            openCreateActivityModal={openModal}
            setOpenCreateActivityModal={setOpenModal}
          />
        )}
      </UICard>
    </div>
  );
};

export default ScheduledTimeSlots;
