import { CheckCircle, Edit, Receipt, RemoveRedEye, Settings } from '@mui/icons-material';
import { Chip, CircularProgress, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';
import dayjs from 'dayjs';
import { UIIconButton } from '@/shared/components';
import { formatNumber } from '@/hooks/formatNumber';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const getOrderColumnHistory = ({
  onMarksAsComplete,
  handleClientSecret,
  user,
  handleClickOpen,
  downloadReceipt,
} = {}) => [
  {
    minWidth: 150,
    field: 'id',
    headerName: 'Order Id',
    flex: 0.8,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    minWidth: 150,
    field: 'title',
    headerName: 'Title',
    flex: 0.8,
    sortable: true,
    resizable: false,
    renderCell: ({ row }) => {
      return row?.service?.title;
    },
  },
  {
    minWidth: 150,
    field: 'customer',
    headerName: 'Customer',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.first_name + ' ' + params?.last_name;
    },
  },
  ...(user?.role !== 'light_worker'
    ? [
        {
          minWidth: 150,
          field: 'light_worker_id',
          headerName: 'Own by',
          flex: 0.8,
          sortable: true,
          resizable: false,
          valueFormatter: (params) =>
            params?.first_name || params?.last_name
              ? `${params?.first_name} ${params?.last_name}`
              : `-`,
        },
      ]
    : []),
  {
    minWidth: 120,
    field: 'type',
    headerName: 'Type',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: ({ row }) => {
      return row?.service?.type === 'service'
        ? 'Reading to - One Off'
        : 'Class to - monthly Subscription';
    },
  },
  {
    minWidth: 120,
    field: 'start_amount',
    headerName: 'Start Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return `${formatNumber(params)} AUD`;
    },
  },

  // {
  //   minWidth: 120,
  //   field: 'discount_percentage',
  //   headerName: 'Discount %',
  //   flex: 1.2,
  //   sortable: true,
  //   resizable: false,
  //   align: 'center',
  //   headerAlign: 'center',
  //   valueFormatter: (params) => {
  //     return formatNumber(params);
  //   },
  // },
  {
    minWidth: 120,
    field: 'discount_amount',
    headerName: 'Discounted Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return `${formatNumber(params)} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'tips_amount',
    headerName: 'Tip Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: (params) => {
      return `${formatNumber(params)} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'final_amount',
    headerName: 'Final Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return `${formatNumber(params)} AUD`;
    },
  },
  {
    minWidth: 120,
    field: 'commission_fee',
    headerName: 'Commission Fee',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      return `${formatNumber(params)} AUD`;
    },
  },
  {
    minWidth: 120,
    headerName: 'Payout Amount',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      return `${formatNumber(row?.final_amount - row?.commission_fee)} AUD`;
    },
  },
  {
    minWidth: 80,
    field: 'rating',
    headerName: 'Rating',
    flex: 1.2,
    sortable: true,
    resizable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      return row.status === 'pending' ? '-' : row.rating;
    },
  },

  {
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    flex: 0.8,
    sortable: true,
    resizable: false,
    valueFormatter: (params) => {
      return params?.toUpperCase();
    },
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      let status = params?.value;
      if (params?.row?.service?.type === 'class') status = params?.row?.subscription?.status;
      return (
        <Chip
          label={status}
          color={orderStatus[status]}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
  {
    minWidth: 200,
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      const isInprogress = params?.row?.status === 'inprogress';
      const isUnpaid = params?.row?.commission_fee_status === 'unpaid';
      const isAdmin = user?.role === 'admin';
      const isAustralian = params?.row?.light_worker_id?.country_code === 'AU';
      return (
        <Stack direction="row" gap={1} alignItems="center" height={1}>
          <Tooltip title={'View details'}>
            <UIIconButton
              component={Link}
              href={`service-order-history/${params.id}/details`}
              size="small"
              fillable
            >
              <RemoveRedEye />
            </UIIconButton>
          </Tooltip>
          {isInprogress && (
            <Tooltip title={'Mark as complete'} onClick={() => onMarksAsComplete(params.row.id)}>
              <UIIconButton size="small" fillable>
                <CheckCircle />
              </UIIconButton>
            </Tooltip>
          )}
          {params?.row?.payment_screenshot && (
            <Tooltip
              title={'Manage Status'}
              onClick={() =>
                handleClickOpen({
                  id: params.row.id,
                  payment_screenshot: params.row.payment_screenshot,
                  row: params.row,
                })
              }
            >
              <UIIconButton size="small" fillable>
                <Settings />
              </UIIconButton>
            </Tooltip>
          )}

          {params?.row?.status !== 'pending' && !isAdmin && !isAustralian && isUnpaid && (
            <Tooltip title={'Pay'} onClick={() => handleClientSecret(params?.row)}>
              <UIIconButton size="small" fillable>
                <LocalAtmIcon />
              </UIIconButton>
            </Tooltip>
          )}
          {params?.row?.stripe_commission_intent_success_payment_intent_response?.latest_charge
            ?.receipt_url && (
            <Tooltip
              title={'View Invoice'}
              // onClick={() =>
              //   downloadReceipt(
              //     params?.row?.stripe_commission_intent_success_payment_intent_response
              //       ?.latest_charge?.receipt_url
              //   )
              // }
            >
              <Link
                href={
                  params?.row?.stripe_commission_intent_success_payment_intent_response
                    ?.latest_charge?.receipt_url
                }
                rel="noopener noreferrer"
                target="_blank"
                download="tests"
              >
                <UIIconButton size="small" fillable>
                  <Receipt />
                </UIIconButton>
              </Link>
            </Tooltip>
          )}
        </Stack>
      );
    },
  },
];

export default getOrderColumnHistory;

let orderStatus = {
  delivered: 'success',
  completed: 'success',
  refunded: 'error',
  canceled: 'error',
  pending: 'info',
  past_due: 'warning',
  incomplete_expired: 'warning',
  active: 'info',
  inprogress: 'warning',
};

// let orderStatus = {
//   delivered: '#90EE90',  // Light green
//   completed: '#87CEEB',  // Light blue
//   refunded: '#FFB6C1',   // Light pink
//   canceled: '#FFA07A',   // Light salmon
//   pending: '#FFD700',    // Gold (light yellow)
//   past_due: '#FFA500',   // Orange
//   incomplete_expired: '#D3D3D3', // Light gray
//   active: '#98FB98',     // Pale green
// };

// let orderStatus = {
//   delivered: '#32CD32',  // Lime green
//   completed: '#4682B4',  // Steel blue
//   refunded: '#DC143C',   // Crimson
//   canceled: '#FF6347',   // Tomato
//   pending: '#FFA500',    // Orange
//   past_due: '#FF4500',   // Orange red
//   incomplete_expired: '#A9A9A9', // Dark gray
//   active: '#3CB371',     // Medium sea green
// };
