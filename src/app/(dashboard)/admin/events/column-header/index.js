import { CheckCircle, Edit, ForwardToInbox, RemoveRedEye } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, Stack, Switch, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { UIIconButton } from '@/shared/components';
import { CalendarIcon } from '@mui/x-date-pickers';

const getEventsColumnHeader = ({ onInvite, onMarksAsComplete, user, onStatusChange, onDelete } = {}) => {

  return [

    {
      minWidth: 200,
      field: 'nameAndBanner',
      headerName: 'Title',
      sortable: true,
      flex: 1,
      resizable: false,
      renderCell: ({ row }) => {
        return (
          <Stack direction="row" alignItems="center" gap={1} height={1}>
            {row?.banner_image &&
              <Image
                src={row?.banner_image}
                alt="Group Activities banner"
                width={40}
                height={40}
                style={{ borderRadius: '4px' }}
              />
            }
            <Typography variant="body2" noWrap>
              {row?.title}
            </Typography>
          </Stack>
        );
      },
    },
    // {
    //   minWidth: 120,
    //   field: 'title',
    //   headerName: 'Title',
    //   flex: 0.8,
    //   sortable: true,
    //   resizable: false,
    // },
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
      field: 'joined_people',
      headerName: 'People Joined',
      flex: 1.2,
      sortable: true,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
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
      field: 'event_date',
      headerName: 'Group Activities Date',
      flex: 0.8,
      sortable: true,
      resizable: false,
      renderCell: ({ row }) => {
        return dayjs(row?.event_date).format(process.env.NEXT_PUBLIC_DATE_FORMAT)
      },
    },
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
      field: 'status',
      headerName: 'Status',
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const { id, status } = row;
        return (
          <Switch
            defaultChecked={status === 'active'}
            onChange={() => onStatusChange(id, status === 'active' ? 'inactive' : 'active')}
          />
        );
      },
    },

    {
      minWidth: 120,
      field: 'registration_status',
      headerName: 'Status',
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
        return (
          <Stack direction="row" gap={1} alignItems="center" height={1}>
            <Tooltip title={'View details'}>
              <UIIconButton component={Link} href={`events/details/${row.id}`} size="small" fillable>
                <RemoveRedEye />
              </UIIconButton>
            </Tooltip>
            {row?.event_cycle_status !== 'completed' && (
              <Tooltip title={'Edit'}>
                <UIIconButton component={Link} href={`events/update/${row.id}`} size="small" fillable>
                  <Edit />
                </UIIconButton>
              </Tooltip>
            )}
            {row.registration_status === 'approved' && row?.event_cycle_status !== 'completed' && (
              <Tooltip title={'Announcements'}>
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
            {row.registration_status === 'approved' && user?.country_code === 'AU' && row?.event_cycle_status !== 'completed' && (
              <Tooltip
                title={'Manage Invites'}
                component={Link}
                href={`events/event-invites/${row.id}/${row?.organizer?.id}`}
              >
                <UIIconButton size="small" fillable>
                  <ForwardToInbox />
                </UIIconButton>
              </Tooltip>
            )}
            {row?.registration_status === 'approved' && row?.event_cycle_status !== 'completed' && (
              <Tooltip title={'Mark as complete'} onClick={() => onMarksAsComplete(row.id)}>
                <UIIconButton size="small" fillable>
                  <CheckCircle />
                </UIIconButton>
              </Tooltip>
            )}
            {row?.event_cycle_status !== 'completed' && (
              <Tooltip title={'Delete'} onClick={() => onDelete(row.id)}>
                <UIIconButton size="small" fillable>
                  <DeleteIcon />
                </UIIconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];
}
export default getEventsColumnHeader;
