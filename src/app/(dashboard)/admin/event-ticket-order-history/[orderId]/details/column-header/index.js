const getSingleOrderColumnHistory = () => [
  {
    minWidth: 120,
    field: 'first_name',
    headerName: 'First Name',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.first_name || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'last_name',
    headerName: 'Last Name',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.last_name || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'email',
    headerName: 'Email',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.email || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'phone_number',
    headerName: 'Phone Number',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.phone_number || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'business_name',
    headerName: 'Business Name',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.business_name || 'N/A';
    },
  },
  {
    minWidth: 120,
    field: 'abn',
    headerName: 'ABN',
    flex: 1.2,
    sortable: true,
    resizable: false,
    renderCell: (params) => {
      console.log('params value', params);
      return params?.row?.user?.abn || 'N/A';
    },
  },
];

export default getSingleOrderColumnHistory;
