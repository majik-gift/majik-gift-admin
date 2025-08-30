import { CheckCircle, Edit, ForwardToInbox, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip, Typography, Avatar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import { CalendarIcon } from '@mui/x-date-pickers';

const getEventsColumnHeader = ({ onMarksAsComplete = () => { }, user } = {}) => [
  {
    minWidth: 200,
    field: 'title',
    headerName: 'Title',
    sortable: true,
    flex: 1,
    resizable: false,
    renderCell: ({ row }) => {
      return (
        <Stack direction="row" alignItems="center" gap={1} height={1}>
          <Avatar
            src={row?.banner_image || ''}
            alt="Service banner"
            width={40}
            height={40}
            style={{ borderRadius: '4px' }}
          />
          <Typography variant="body2" noWrap>
            {row?.title}
          </Typography>
        </Stack>
      );
    },
  },
  {
    minWidth: 120,

    field: 'total_price',
    headerName: 'Price',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return `${params} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'slots',
    headerName: 'Seats',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 120,
    field: 'joined_people',
    headerName: 'People Joined',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  // {
  //   minWidth: 120,
  //   field: 'fee_option',
  //   headerName: 'Fee Option',
  //   flex: 1.2,
  //   sortable: true,
  //   resizable: false,
  // },
  {
    minWidth: 120,
    field: 'event_cycle_status',
    headerName: 'Group Activities Status',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.toUpperCase();
    },
    renderCell: (params) => {
      const status = params?.row?.event_cycle_status;
      return (
        <Chip
          label={status}
          color={status === 'completed' ? 'success' : status === 'rejected' ? 'error' : 'warning'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
  {
    minWidth: 120,
    field: 'registration_status',
    headerName: 'Registration status',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.toUpperCase();
    },
    renderCell: (params) => {
      return (
        <Chip
          label={params.value}
          color={
            params.value === 'approved'
              ? 'success'
              : params.value === 'rejected'
                ? 'error'
                : 'warning'
          }
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
  {
    minWidth: 260,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
    renderCell: ({ row }) => {
    console.log("🚀 ~ row:", row)

      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title={'View details'}>
            <UIIconButton component={Link} href={`events/details/${row.id}`} size="small" fillable>
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          {user?.id === row?.organizer?.id && row?.event_cycle_status !== 'completed' && (
            <Tooltip title={'Edit'}>
              <UIIconButton component={Link} href={`events/update/${row.id}`} size="small" fillable>
                <Edit />
              </UIIconButton>
            </Tooltip>
          )}
          {row.registration_status === 'approved' && row?.event_cycle_status !== 'completed' && (
            <Tooltip title={'Activities'}>
              <UIIconButton
                component={Link}
                href={`events/activities/${row.id}`}
                size="small"
                fillable
              >
                <CalendarIcon />
              </UIIconButton>
            </Tooltip>
          )}
          {user?.id === row?.organizer?.id &&
            user?.country_code === 'AU' &&
            row.registration_status === 'approved' &&
            row?.event_cycle_status !== 'completed' && (
              <Tooltip
                title={'Manage Invites'}
                component={Link}
                href={`events/event-invites/${row.id}`}
              >
                <UIIconButton size="small" fillable>
                  <ForwardToInbox />
                </UIIconButton>
              </Tooltip>
            )}
          {user?.id === row?.organizer?.id &&
            row.registration_status === 'approved' &&
            row?.event_cycle_status !== 'completed' && (
              <Tooltip title={'Mark as complete'} onClick={() => onMarksAsComplete(row.id)}>
                <UIIconButton size="small" fillable>
                  <CheckCircle />
                </UIIconButton>
              </Tooltip>
            )}
        </Stack>
      );
    },
  },
];

export default getEventsColumnHeader;
