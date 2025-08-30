import { Edit, RemoveRedEye, Settings } from '@mui/icons-material';
import { Chip, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getOrderColumnHistory = ({ handleClickOpen } = {}) => [
  {
    minWidth: 150,
    field: 'id',
    headerName: 'Order Id',
    flex: 0.8,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 150,
    field: 'title',
    headerName: 'Title',
    flex: 0.8,
    sortable: true,
    resizable: false,
    renderCell: ({ row }) => {
      return row?.event?.title;
    },
  },
  {
    minWidth: 150,
    field: 'customer',
    headerName: 'Customer',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params.first_name + ' ' + params.last_name;
    },
  },
  {
    minWidth: 150,
    field: 'organizer_id',
    headerName: 'Organizer',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.first_name ? params?.first_name + ' ' + params?.last_name : '_';
    },
  },

  {
    minWidth: 120,
    field: 'price',
    headerName: 'Start Amount',
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
    field: 'discount_amount',
    headerName: 'Discount Amount',
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
    field: 'tips_amount',
    headerName: 'Tip Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: (params) => {
      return `${params} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'total_price',
    headerName: 'Final Amount',
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
    field: 'commission_fee',
    headerName: 'Commission Fee',
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
    headerName: 'Payout Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      return `${row?.total_price - row?.commission_fee} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'refund_amount',
    headerName: 'Refund amount',
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
    field: 'rating',
    headerName: 'Rating',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      return row.status === 'pending' ? '-' : row.rating;
    },
  },

  {
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.toUpperCase();
    },
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      return (
        <Chip
          label={params.value}
          color={orderStatus[params?.value]}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
  {
    minWidth: 120,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
    headerAlign: 'center',

    renderCell: (params) => {
      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title={'View details'}>
            <UIIconButton
              component={Link}
              href={`event-ticket-order-history/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          {params?.row?.payment_screenshot && (
            <Tooltip
              title={'Manage Status'}
              onClick={() =>
                handleClickOpen({
                  id: params.row.id,
                  payment_screenshot: params.row.payment_screenshot,
                  row: params.row
                })
              }
            >
              <UIIconButton size="small" fillable>
                <Settings />
              </UIIconButton>
            </Tooltip>
          )}
        </Stack>
      );
    },
  },
];

export default getOrderColumnHistory;

let orderStatus = {
  delivered: 'success',
  fulfilled: 'success',
  refunded: 'error',
  pending: 'warning',
  upcoming: 'info'
};
