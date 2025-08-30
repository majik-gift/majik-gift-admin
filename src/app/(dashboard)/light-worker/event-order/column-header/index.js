import { Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getOrderColumnHistory = ({ onDelete } = {}) => [
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
    minWidth: 120,
    field: 'total_price',
    headerName: 'Total Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
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
      return 0;
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
    renderCell: (params) => {
      return params.value ?? '-';
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
              href={`order-history/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={'Edit'}>
            <UIIconButton
              component={Link}
              href={`order-history/update/${params.id}`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getOrderColumnHistory;

let orderStatus = {
  delivered: 'success',
  completed: 'info',
  refunded: 'error',
  pending: 'warning',
};
