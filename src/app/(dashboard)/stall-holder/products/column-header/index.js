import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip, Typography, Avatar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getProductsColumnHeader = ({ onDelete } = {}) => [
  {
    minWidth: 200,
    field: 'nameAndBanner',
    headerName: 'Name',
    flex: 1.5,
    sortable: false,
    resizable: false,
    renderCell: ({ row }) => {
      return (
        <Stack direction="row" alignItems="center" gap={1} height={1}>
          <Image
            src={row?.banner_image || ''}
            alt="Product banner"
            width={40}
            height={40}
            style={{ borderRadius: '4px' }}
          />
          <Typography variant="body2" noWrap>
            {row?.name}
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
    field: 'diameter',
    headerName: 'Diameter',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 120,
    field: 'height',
    headerName: 'Height',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 120,
    field: 'weight',
    headerName: 'Weight',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 120,
    field: 'note',
    headerName: 'Description',
    flex: 1.2,
    sortable: true,
    resizable: false,
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
    field: 'registration_status',
    headerName: 'Status',
    flex: 0.8,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
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
    minWidth: 150,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title={'View details'}>
            <UIIconButton
              component={Link}
              href={`products/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={'Edit'}>
            <UIIconButton
              component={Link}
              href={`products/update/${params.id}`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
          <Tooltip title={'Delete'} onClick={() => onDelete(params)}>
            <UIIconButton size="small" fillable>
              <Delete />
            </UIIconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getProductsColumnHeader;
