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
import getServicesColumnHeader from './column-header';
import { useApiRequest } from '@/hooks/useApiRequest';
import useDataTable from '@/hooks/useDataTable';
import { UIButton, UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import { getTimeSlots } from '@/store/services/services.thunk';
import GetTimeSlotsActions from './action/get-time-slots-actions';
import servicesApi from '@/apis/services/services.api';
import axiosInstance from '@/shared/services/axiosInstance';
import { useState } from 'react';

const TimeSlots = ({params}) => {
 
  const { showDialog } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const isStripeConnect =
    user?.stripeConnectStatus == 'connect_required' || user?.stripeConnectStatus == 'under_review';

  const { tableProps, fetching, deleteRowHandler, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getTimeSlots, // Your Redux asyncThunk or API function
    serverPagination: true,
    initialExtraParams: {
      id:params?.id, day: 'monday' 
    },
  });

  const [deleteTimeSlotApi, loading, error] = useApiRequest(servicesApi.deleteTImeSlot);
  const deleteTimeSlot = (id, preFix) => async (closeHandler) => {
    try {
      const data =  await deleteTimeSlotApi({ id });
      const removeDeletedRow = (data) => {
        return {
          details: {
            ...data?.details,
            time_slots: {
              ...data?.details?.time_slots,
              [preFix]: data?.details?.time_slots[preFix].filter(
                (tableData) => tableData['id'] !== id
              ),
            },
          },
        };
      };
      deleteRowHandler(id);
      const updatedData = removeDeletedRow(data);
      updateState('data', updatedData);
    } catch (error) {
    } finally {
      closeHandler();
    }
  };
    const handleStatusChange = async (id, newStatus) => {
      try {
        setIsLoading(true);
        await axiosInstance.patch(`time-slot/${id}`, { status: newStatus });
        addToast({
          severity: 'success',
          message: `Time slot status updated to ${newStatus}.`,
        });
      } catch (error) {
        console.error('Error updating status:', error);
        addToast({
          severity: 'error',
          message: 'Failed to update time slot status.',
        });
      } finally {
        setIsLoading(false);
      }
    };


  const deleteHandler = (id) => {
    showDialog({
      title: 'Are you Sure?',
      message: 'You want to delete this time slot',
      actionText: 'Yes',
      showLoadingOnConfirm: true,
    }).then(deleteTimeSlot(id));
  };

  const tableHeaders = getServicesColumnHeader({ deleteHandler,onStatusChange:handleStatusChange });

  return (
    <div>
      <UICard
        pageHeight
        backButton
        heading={'Time Slots'}
        action={
          <UIButton
            component={Link}
            href={`time-slots/create`}
          >
            Create Time Slots
          </UIButton>
        }
      >
        <GetTimeSlotsActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable
          tableData={fetching.list}
          loading={fetching.loading || isLoading}
          tableColumns={tableHeaders}
          {...tableProps}
        />
      </UICard>
    </div>
  );
};

export default TimeSlots;
