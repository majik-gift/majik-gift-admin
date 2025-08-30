import { Delete, Edit } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import { capitalize } from 'lodash';

import { UIIconButton } from '@/shared/components';
import dayjs from 'dayjs';
import Link from 'next/link';

const getCouponColumnHeader = ({ user, onDelete }) => [
  {
    minWidth: 120,
    field: 'type',
    headerName: 'Type',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return capitalize(params);
    },
  },
  {
    minWidth: 120,
    field: 'Relevant entity',
    // headerName: 'Relevant entity',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params, value) => {
      return value[value.type]
        ? value[value.type].name
          ? value[value.type].name
          : value[value.type].title
        : '-';
    },
  },
  {
    minWidth: 120,
    field: 'code',
    headerName: 'Code',
    flex: 0.8,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 120,
    field: 'discount_percentage',
    headerName: 'Discount percentage',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return `${params}%`;
    },
  },

  {
    minWidth: 120,
    headerName: 'Redeem limit',
    field: 'usage_limit',
    flex: 1.2,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 120,
    headerName: 'Max Redeemed time',
    field: 'usage_count',
    flex: 1.2,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return capitalize(params);
    },
  },
  {
    minWidth: 120,
    field: 'expire_at',
    headerName: 'Expire at',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return dayjs(params).format(process.env.NEXT_PUBLIC_DATE_FORMAT);
    },
  },

  {
    minWidth: 120,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
    renderCell: (params) => {

      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title={'Edit'}>
            <UIIconButton
              component={Link}
              href={`/${user?.role === 'admin' ? 'admin' : user?.role === 'stall_holder' ? 'stall-holder' : user?.role === 'light_worker' ? 'light-worker' : ''}/coupons/update/${params.id}`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={'Delete'} onClick={() => onDelete(params?.id)}>
            <UIIconButton size="small" fillable>
              <Delete />
            </UIIconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getCouponColumnHeader;
