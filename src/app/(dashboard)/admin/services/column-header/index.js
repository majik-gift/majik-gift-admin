import { AccessTime, Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Avatar, Chip, Stack, Tooltip, Typography, Switch } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { UIIconButton } from '@/shared/components';
import { CalendarIcon } from '@mui/x-date-pickers';

const getServicesColumnHeader = ({ deleteHandler, onStatusChange } = {}) => [
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
    field: 'own_by',
    headerName: 'Own by',
    sortable: true,
    flex: 1,
    resizable: false,
    renderCell: ({ row }) => {
      return `${row?.created_by?.first_name} ${row?.created_by?.last_name}`;
    },
  },
  {
    minWidth: 120,
    field: 'type',
    headerName: 'Type',
    sortable: true,
    flex: 1,
    resizable: false,
    renderCell: ({ row }) => {
      return row?.type === 'service' ? 'Reading to - One Off' : 'Class to - monthly Subscription';
    },
  },
  {
    minWidth: 120,
    field: 'total_price',
    headerName: 'Price',
    sortable: true,
    resizable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (row) => {
      return `${row} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'registration_status',
    headerName: 'Reg Status',
    flex: 1.2,
    sortable: true,
    align: 'center',
    headerAlign: 'center',
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
    minWidth: 230,
    field: 'action',
    headerName: 'Action',
    sortable: true,
    resizable: false,
    flex: 1,
    renderCell: (params, value) => {
      const orders = params?.row?.order.length;
      return (
        <Stack direction="row" spacing={1} height="100%" alignItems="center">
          <Tooltip title={'View details'}>
            <UIIconButton
              component={Link}
              href={`services/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={'Time slots'}>
            <UIIconButton
              component={Link}
              href={`services/${params.id}/time-slots`}
              size="small"
              fillable
            >
              <AccessTime />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={orders ? 'Complete shceduled orders before edit' : 'Edit'}>
            <span>
              <UIIconButton
                component={Link}
                href={`services/${params.id}/update`}
                size="small"
                fillable
                disabled={orders}
              >
                <Edit />
              </UIIconButton>
            </span>
          </Tooltip>
          {params?.row?.type === 'class' && (
            <Tooltip title={'Activities'}>
              <UIIconButton
                component={Link}
                href={`/admin/services/activities/${params.id}`}
                size="small"
                fillable
              >
                <CalendarIcon />
              </UIIconButton>
            </Tooltip>
          )}
          <Tooltip title={orders ? 'Complete shceduled orders before delete' : 'Delete'}>
            <span>
              <UIIconButton
                onClick={() => deleteHandler(params.id)}
                size="small"
                color="error"
                fillable
                disabled={orders}
              >
                <Delete />
              </UIIconButton>
            </span>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getServicesColumnHeader;
