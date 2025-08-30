'use client';
import { Stack, Grid2 } from '@mui/material';
import { UISearchField, UISelect, UIAutocomplete } from '@/shared/components';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const GetProductActions = ({ fetchTableData, extraParams, setExtraParams }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const getOnChange = (name) => (e) =>
    setExtraParams((prev) => ({ ...prev, [name]: String(e.target.value).trim(' ') }));

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row" width={'100%'}>
        <Grid2 container spacing={2} width={'100%'}>
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UISearchField fullWidth onChange={getOnChange('search')} value={extraParams.search} />
          </Grid2>

          {isAdmin && (
            <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <UIAutocomplete
                name="lightWorkerId"
                placeholder="Select Light Worker"
                fullWidth
                multiple={false}
                control={null}
                url={`users?roles[]=admin&roles[]=light_worker&registration_status=approved`}
                value={extraParams.lightWorkerId}
                onChange={(newValue) => {
                  setExtraParams((prev) => ({
                    ...prev,
                    serviceId: null,
                    lightWorkerId: newValue,
                  }));
                }}
              />
            </Grid2>
          )}

          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UIAutocomplete
              name="serviceId"
              placeholder="Select Service"
              fullWidth
              multiple={false}
              control={null}
              url={
                isAdmin && extraParams.lightWorkerId
                  ? `service?userId[]=${extraParams?.lightWorkerId?.value}&registration_status=approved`
                  : `service?&registration_status=approved`
              }
              value={extraParams.serviceId}
              onChange={(newValue) => {
                setExtraParams((prev) => ({
                  ...prev,
                  serviceId: newValue,
                }));
              }}
            />
          </Grid2>

          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <UISelect
              showEmptyOption
              fullWidth
              value={extraParams.status}
              onChange={getOnChange('status')}
              minWidth="7rem"
              nativeLabel="Status"
              options={statusData}
            />
          </Grid2>
        </Grid2>
      </Stack>
    </div>
  );
};

export default GetProductActions;

const statusData = [
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Refunded',
    value: 'refunded',
  },
];
