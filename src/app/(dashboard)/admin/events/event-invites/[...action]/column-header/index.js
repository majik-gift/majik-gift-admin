import { UIIconButton } from '@/shared/components';
import { Cancel } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';

import dayjs from 'dayjs';
import { capitalize } from 'lodash';

const getCouponColumnHeader = ({ onDelete = () => { } }) => [
  {
    minWidth: 120,
    field: '',
    headerName: 'Light worker',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params, row) => {
      return row.user.first_name + ' ' + row.user.last_name;
    },
  },
  {
    minWidth: 120,
    field: 'user.email',
    headerName: 'Email',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params, row) => {
      return row.user.email;
    },
  },
  {
    minWidth: 120,
    field: 'Invitation status',
    // headerName: 'Relevant entity',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params, value) => {
      return capitalize(value.status);
    },
  },

  {
    minWidth: 120,
    field: 'invited_at',
    headerName: 'Invited at',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return dayjs(params).format(process.env.NEXT_PUBLIC_DATE_FORMAT);
    },
  },

  {
    minWidth: 120,
    // field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
    renderCell: (params, row) => {
      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          {params?.row?.status === 'pending' && (
            <Tooltip title={'Delete invitation'} onClick={() => onDelete(params.id)}>
              <UIIconButton size="small" fillable>
                <Cancel />
              </UIIconButton>
            </Tooltip>
          )}
        </Stack>
      );
    },
  },
];

export default getCouponColumnHeader;
