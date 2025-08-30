import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip, Typography, Avatar } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import Image from 'next/image';

const getSingleOrderColumnHistory = ({ onDelete } = {}) => [
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
          <Avatar
            src={row?.product?.banner_image || ''}
            alt="Group Activities banner"
            width={40}
            height={40}
            style={{ borderRadius: '4px' }}
          />
          <Typography variant="body2" noWrap>
            {row?.product?.name}
          </Typography>
        </Stack>
      );
    },
  },
  {
    minWidth: 120,
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
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
    renderCell: ({ row }) => {
      return `${row?.final_amount} AUD`;
    },
  },
];

export default getSingleOrderColumnHistory;

let orderStatus = {
  delivered: 'success',
  completed: 'info',
  refunded: 'error',
  pending: 'warning',
};
