// 'use client';

// import servicesApi from '@/apis/services/services.api';
// import { useApiRequest } from '@/hooks/useApiRequest';
// import { ApiLoader, UIButton, UICard } from '@/shared/components';
// import { useToast } from '@/shared/context/ToastContext';
// import { Grid2, Typography } from '@mui/material';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import GetTimeSlotsActions from './action/get-time-slots-actions';
// import ServiceCard from './component/ServiceCard';

// const TimeSlots = () => {
//   const { showDialog } = useToast();
//   const { id } = useParams();

//   const [fetchApi, fetchLoading, fetchError, data, , updateState] = useApiRequest(
//     servicesApi.getTimeSlots,
//     {
//       initFetch: true,
//       apiProps: {
//         params: { id, day: 'monday' },
//       },
//     }
//   );

//   const [deleteTimeSlotApi, loading, error] = useApiRequest(servicesApi.deleteTImeSlot);

// const deleteTimeSlot = (id, preFix) => async (closeHandler) => {
//   try {
//     await deleteTimeSlotApi({ id });
//     const removeDeletedRow = (data) => {
//       return {
//         details: {
//           ...data?.details,
//           time_slots: {
//             ...data?.details?.time_slots,
//             [preFix]: data?.details?.time_slots[preFix].filter(
//               (tableData) => tableData['id'] !== id
//             ),
//           },
//         },
//       };
//     };
//     const updatedData = removeDeletedRow(data);
//     updateState('data', updatedData);
//   } catch (error) {
//   } finally {
//     closeHandler();
//   }
// };

//   const deleteHandler = (id, preFix) => {
//     showDialog({
//       title: 'Are you Sure?',
//       message: 'You want to delete this service',
//       actionText: 'Yes',
//       showLoadingOnConfirm: true,
//     }).then(deleteTimeSlot(id, preFix));
//   };

//   const renderTimeSlots = (slots, preFix, title) => (
//     <Grid2 size={{ xl: 3, lg: 6, md: 6, xs: 12 }}>
//       <UICard heading={title} sx={{ maxHeight: '90vh', height: '100%' }} asChild>
//         <ApiLoader loading={fetchLoading} h={'30vh'} error={fetchError}>
//           {slots?.length ? (
//             slots.map((slot) => (
// <ServiceCard key={slot.id} data={slot} handleDelete={deleteHandler} preFix={preFix} />
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No {preFix} slots available.
//             </Typography>
//           )}
//         </ApiLoader>
//       </UICard>
//     </Grid2>
//   );

//   return (
//     <div>
//       <UICard
//         backButton
//         pageHeight
//         heading={'Time Slots'}
//         action={
//           <UIButton component={Link} href="time-slots/create">
//             Create Time Slots
//           </UIButton>
//         }
//       >
//         <GetTimeSlotsActions fetchData={fetchApi} />
//         {/* Morning Time Slots */}
//         <Grid2 container spacing={2}>
//           {renderTimeSlots(data?.details?.time_slots?.morning, 'morning', 'Morning')}
//           {renderTimeSlots(data?.details?.time_slots?.afternoon, 'afternoon', 'Afternoon')}
//           {renderTimeSlots(data?.details?.time_slots?.evening, 'evening', 'Evening')}
//           {renderTimeSlots(data?.details?.time_slots?.night, 'night', 'Night')}
//         </Grid2>
//       </UICard>
//     </div>
//   );
// };

// export default TimeSlots;

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
  const { showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
