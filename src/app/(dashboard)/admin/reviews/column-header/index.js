import { Delete, Edit, RemoveRedEye, Star } from '@mui/icons-material';
import { Chip, Rating, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';
import { capitalize } from '@/shared/utilis/utilis';

const getReviewsColumnHeader = ({ onDelete } = {}) => [
  {
    minWidth: 120,
    field: 'id',
    headerName: 'ID',
    flex: 0.5,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 150,
    field: 'user',
    headerName: 'Customer',
    flex: 1,
    sortable: false,
    resizable: false,
    valueGetter: (params) => {
      return params?.row?.user?.name || params?.row?.user?.email || 'N/A';
    },
    renderCell: (params) => {
      const user = params?.row?.user;
      return (
        <Stack>
          <Typography variant="body2" fontWeight="medium">
            {user?.name || 'N/A'}
          </Typography>
          {user?.email && (
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Stack>
      );
    },
  },
  {
    minWidth: 120,
    field: 'rating',
    headerName: 'Rating',
    flex: 0.8,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      const rating = params?.value || 0;
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating value={rating} readOnly size="small" precision={0.5} />
          <Typography variant="body2">{rating}</Typography>
        </Stack>
      );
    },
  },
  {
    minWidth: 200,
    field: 'comment',
    headerName: 'Comment',
    flex: 2,
    sortable: false,
    resizable: false,
    renderCell: (params) => {
      const comment = params?.value || '';
      return (
        <Tooltip title={comment}>
          <Typography variant="body2" sx={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {comment || 'No comment'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    minWidth: 120,
    field: 'reviewable_type',
    headerName: 'Type',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      const value = params || '';
      return value
        .toLowerCase()
        .replace('_', ' ')
        .split(' ')
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
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title="View details">
            <UIIconButton
              component={Link}
              href={`/admin/reviews/${params.id}`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <UIIconButton
              component={Link}
              href={`/admin/reviews/update/${params.id}`}
              size="small"
              fillable
            >
              <Edit />
            </UIIconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <UIIconButton size="small" fillable onClick={() => onDelete(params.row)}>
              <Delete />
            </UIIconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default getReviewsColumnHeader;

