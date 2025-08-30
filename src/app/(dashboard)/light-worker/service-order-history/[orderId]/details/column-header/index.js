import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import Image from 'next/image';

const getSingleOrderColumnHistory = ({ onDelete } = {}) => [
  {
    minWidth: 120,
    field: 'final_amount',
    headerName: 'Final Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
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
    minWidth: 150,
    field: 'product_name',
    headerName: 'Product Name',
    flex: 0.8,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      return params.row.product?.name || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'banner_image',
    headerName: 'Image',
    flex: 0.8,
    sortable: true,
    resizable: false,
    headerAlign: 'center',
    renderCell: (params) => {
      const imageUrl = params.row.product?.banner_image;
      return (
        <Stack justifyContent="center" alignItems="center" height={1}>
          {imageUrl ? (
            <Image src={imageUrl} alt="Product Image" width={40} height={40} priority />
          ) : (
            'No Image'
          )}
        </Stack>
      );
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
