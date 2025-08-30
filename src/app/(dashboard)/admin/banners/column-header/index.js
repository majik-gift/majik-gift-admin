import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Box, Chip, Stack, Tooltip } from '@mui/material';
import { capitalize } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';

import { UIIconButton } from '@/shared/components';

const getBannersColumnHeader = ({ onDelete } = {}) => [
  {
    minWidth: 120,
    field: 'banner_image',
    headerName: 'Banner Image',
    flex: 0.8,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      return (
        <Stack justifyContent="center" alignItems="center" height={1}>
          <Image src={params.value} alt="" width={40} height={40} />
        </Stack>
      );
    },
  },
  {
    minWidth: 120,
    field: 'title',
    headerName: 'Title',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return capitalize(params);
    },
  },
  {
    minWidth: 120,
    field: 'button_text_color',
    headerName: 'Title Color',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            backgroundColor: params?.value,
            width: 20,
            height: 20,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        ></Box>
      );
    },
  },
  {
    minWidth: 120,
    field: 'type',
    headerName: 'Type',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return capitalize(params);
    },
  },
  {
    minWidth: 120,
    field: 'button_text',
    headerName: 'Button Text',
    flex: 1.2,
    sortable: true,
    resizable: false,
  },

  {
    minWidth: 120,
    field: 'order_by',
    headerName: 'Order By',
    flex: 1.2,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return capitalize(params);
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
          <Tooltip title={'Edit'}>
            <UIIconButton
              component={Link}
              href={`banners/update/${params.row.id}`}
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

export default getBannersColumnHeader;
