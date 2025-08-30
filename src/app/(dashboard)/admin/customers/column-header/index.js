import { Edit, RemoveRedEye } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete'
import { Stack, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getColumnHeader = ({onDelete}) => {
  return [
    {
      minWidth: 120,
      field: 'first_name',
      headerName: 'First name',
      flex: 0.8,
      sortable: true,
      resizable: false,
    },
    {
      minWidth: 120,

      field: 'last_name',
      headerName: 'Last name',
      flex: 0.8,
      sortable: true,
      resizable: false,
    },
    {
      minWidth: 120,

      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      sortable: true,
      resizable: false,
    },
    {
      minWidth: 120,

      field: 'phone_number',
      headerName: 'Phone number',
      flex: 1.2,
      sortable: true,
      resizable: false,
    },

    {
      minWidth: 120,
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" height={1} alignItems="center" gap={1}>
            <Tooltip title={'View details'}>
              <UIIconButton
                component={Link}
                href={`customers/${params.id}/details`}
                size="small"
                fillable
              >
                <RemoveRedEye />
              </UIIconButton>
            </Tooltip>
            <Tooltip title={'Edit details'}>
              <UIIconButton
                component={Link}
                href={`customers/${params.id}/update`}
                size="small"
                fillable
              >
                <Edit />
              </UIIconButton>
            </Tooltip>
            <Tooltip title={'Delete'} onClick={()=> onDelete(params.id)}>
              <UIIconButton
                size="small"
                fillable
              >
                <DeleteIcon />
              </UIIconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
};

export default getColumnHeader;
