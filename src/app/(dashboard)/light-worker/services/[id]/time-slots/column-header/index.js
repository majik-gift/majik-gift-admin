import { UIIconButton } from '@/shared/components';
import { Delete, Edit } from '@mui/icons-material';
import { Stack, Switch, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import ViewListIcon from '@mui/icons-material/ViewList';
import { capitalize } from 'lodash';
import Link from 'next/link';

const getProductsColumnHeader = ({ deleteHandler, onStatusChange } = {}) => [
  {
    minWidth: 120,
    field: 'service_name',
    headerName: 'Service Name',
    sortable: true,
    flex: 1,
    resizable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => {
      return capitalize(`${row?.service?.title}`);
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
    field: 'day',
    headerName: 'Day',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: (params) => {
      return capitalize(params);
    },
    sortable: true,
    resizable: false,
    flex: 1,
  },
  {
    minWidth: 120,
    field: 'action',
    headerName: 'Action',
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    renderCell: (params) => {
      const orders = params?.row?.booked_slots?.length;
      return (
        <Stack
          direction="row"
          spacing={1}
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          {orders ? (
            <Tooltip title={'Scheduled Orders'}>
              <UIIconButton
                component={Link}
                href={`time-slots/${params?.id}/details`}
                size="small"
                fillable
              >
                <ViewListIcon />
              </UIIconButton>
            </Tooltip>
          ) : (
            <></>
          )}
          <Tooltip title={'Edit'}>
            <UIIconButton
              component={Link}
              href={`time-slots/${params?.id}/update`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={orders ? 'Complete shceduled orders before delete' : 'Delete'}>
            <span>
              <UIIconButton
                disabled={orders}
                onClick={() => deleteHandler(params.id)}
                size="small"
                color="error"
                fillable
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

export default getProductsColumnHeader;
