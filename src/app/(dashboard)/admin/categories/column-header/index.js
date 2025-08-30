import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import { capitalize } from '@/shared/utilis/utilis';

const getCategoriesColumnHeader = ({ onDelete } = {}) => [
  {
    minWidth: 120,
    field: 'name',
    headerName: 'Name',
    flex: 0.8,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 120,
    field: 'type',
    headerName: 'Type',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      const value = params || '';
      return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  },
  {
    minWidth: 120,
    field: 'created_at',
    headerName: 'Created At',
    flex: 0.8,
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
          {/* <Tooltip title="View details">
            <UIIconButton
              component={Link}
              href={`categories/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip> */}
          <Tooltip title="Edit">
            <UIIconButton
              component={Link}
              href={`categories/update/${params.id}`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
          <Tooltip title="Delete" onClick={() => onDelete(params)}>
            <UIIconButton size="small" fillable>
              <Delete />
            </UIIconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getCategoriesColumnHeader;
