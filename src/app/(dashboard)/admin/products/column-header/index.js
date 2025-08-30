import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Switch, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getProductsColumnHeader = ({ onDelete, onStatusChange } = {}) => [
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
    field: 'own_by',
    headerName: 'Own by',
    sortable: true,
    flex: 1.2,
    resizable: false,
    renderCell: ({ row }) => {
      return `${row?.created_by?.first_name} ${row?.created_by?.last_name}`;
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
    field: 'fee_option',
    headerName: 'Package type',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: ({ row }) =>
      ` ${row.fee_option === 'extras_package' ? 'Excl' : 'Std'} (${row.applied_fee}%)`,
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
    valueFormatter: (row) => {
      return `${row} AUD`;
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
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({row}) => {
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
    minWidth: 150,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
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
