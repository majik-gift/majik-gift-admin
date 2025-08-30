import { Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import { formatNumber } from '@/hooks/formatNumber';

const getOrderColumnHistory = ({ onDelete } = {}) => [
  {
    minWidth: 150,
    field: 'customer',
    headerName: 'Customer',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.first_name + ' ' + params?.last_name;
    },
  },
  {
    minWidth: 150,
    field: 'light_worker_id',
    headerName: 'Light worker',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      if (params?.first_name || params?.last_name) {
        return params?.first_name + ' ' + params?.last_name;
      } else {
        return `-`;
      }
    },
  },

  {
    minWidth: 120,

    field: 'start_amount',
    headerName: 'Start Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return formatNumber(params);
    },
  },
  {
    minWidth: 120,
    field: 'final_amount',
    headerName: 'Final Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return formatNumber(params);
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
      return formatNumber(params);
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
      return formatNumber(params);
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
    align: 'center',
    renderCell: (params) => {
      return (
        <Stack direction="row" gap={1} justifyContent="center" alignItems="center" height={1}>
          <Tooltip title={'View details'}>
            <UIIconButton
              component={Link}
              href={`service-order-history/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
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
