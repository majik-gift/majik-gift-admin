import { Edit, Inventory, RemoveRedEye } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete'
import { Chip, Stack, Switch, Tooltip } from '@mui/material';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getColumnHeader = ({onStatusChange,onDelete}) => {
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
      field: 'business_name',
      headerName: 'Business name',
      flex: 1.2,
      sortable: true,
      resizable: false,
    },

    {
      minWidth: 120,

      field: 'registration_status',
      headerName: 'Registration status',
      flex: 1.2,
      sortable: false,
      resizable: false,
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
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      sortable: true,
      flex: 1,
      resizable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const { id, status } = row;
        return (
          <Switch
            defaultChecked={status === 'active'}
            onChange={(e) => onStatusChange(id, e.target.checked ? 'active' : 'inactive')}
          />
        );
      },
    },
    {
      minWidth: 190,
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: true,
      resizable: false,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Tooltip title={'View details'}>
              <UIIconButton
                component={Link}
                href={`stall-holders/${params.id}`}
                size="small"
                fillable
              >
                <RemoveRedEye />
              </UIIconButton>
            </Tooltip>
            <Tooltip title={'Edit'}>
              <UIIconButton
                component={Link}
                href={`/admin/stall-holders/${params.id}/update`}
                size="small"
                fillable
              >
                <Edit />
              </UIIconButton>
            </Tooltip>
            <Tooltip title={'View Products'}>
              <UIIconButton
                component={Link}
                href={`stall-holders/${params.id}/products`}
                size="small"
                fillable
              >
                <Inventory />
              </UIIconButton>
            </Tooltip>
            <Tooltip title={'Delete'} onClick={()=>onDelete(params.id)}>
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
