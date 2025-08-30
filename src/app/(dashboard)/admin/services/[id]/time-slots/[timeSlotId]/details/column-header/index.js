import dayjs from 'dayjs';
import { capitalize } from 'lodash';

export const getTimeSlotColumnHeader = (records) => {
  return [
    {
      minWidth: 120,
      field: 'service',
      headerName: 'Service Name',
      sortable: true,
      flex: 1,
      resizable: false,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params) => {
        return capitalize(params);
      },
    },
    {
      minWidth: 120,
      field: 'first_name',
      headerName: 'User Name',
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        return `${row?.user?.first_name} ${row?.user?.last_name}`;
      },
    },
    ...(records[0]?.booking_date
      ? [
        {
          minWidth: 120,
          field: 'booking_date',
          headerName: 'Booking Date',
          sortable: true,
          flex: 1,
          resizable: false,
          headerAlign: 'center',
          align: 'center',
        },
      ]
      : []),
    ...(records[0]?.created_at
      ? [
        {
          minWidth: 120,
          field: 'created_at',
          headerName: 'Created At',
          sortable: true,
          flex: 1,
          resizable: false,
          headerAlign: 'center',
          align: 'center',
        },
      ]
      : []),

    {
      minWidth: 120,
      field: 'day',
      headerName: 'Day',
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      resizable: false,
      flex: 1,
      valueFormatter: (params) => {
        return capitalize(params);
      },
    },
    {
      minWidth: 120,
      field: 'start_time',
      headerName: 'Start Time',
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        return dayjs.unix(row?.start_time).format('h:mm a');
      },
    },
    {
      minWidth: 120,
      field: 'end_time',
      headerName: 'End Time',
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        return dayjs.unix(row?.end_time).format('h:mm a');
      },
    },
  ];
};
