import { Edit } from '@mui/icons-material';
import { Stack, Switch, Tooltip } from '@mui/material';

import { UIIconButton } from '@/shared/components';
import Link from 'next/link';

const getCountryColumnHeader = ({ onStatusChange }) => [
  {
    minWidth: 200,
    field: 'name',
    headerName: 'Country Name',
    flex: 1.5,
    sortable: true,
    resizable: false,
  },
  {
    minWidth: 120,
    field: 'code',
    headerName: 'Country Code',
    flex: 1,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params || '-';
    },
  },
  {
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    flex: 1,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      const { id, status } = params.row;
      return (
        <Switch
          checked={status === 'active'}
          onChange={() => onStatusChange(id, status === 'active' ? 'inactive' : 'active')}
          color="primary"
        />
      );
    },
  },
  // {
  //   minWidth: 120,
  //   field: 'action',
  //   headerName: 'Action',
  //   flex: 1,
  //   sortable: false,
  //   renderCell: (params) => {
  //     return (
  //       <Stack direction="row" gap={1} alignItems="center" height={1}>
  //         <Tooltip title={'Edit'}>
  //           <UIIconButton
  //             component={Link}
  //             href={`/admin/countries/update/${params.id}`}
  //             size="small"
  //             fillable
  //           >
  //             <Edit />
  //           </UIIconButton>
  //         </Tooltip>
  //       </Stack>
  //     );
  //   },
  // },
];

export default getCountryColumnHeader;
