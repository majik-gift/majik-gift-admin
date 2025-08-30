import { Grid2, Stack } from '@mui/material';
import useFilters from '@/hooks/useFilters';
import { UIAutocomplete, UISearchField, UISelect } from '@/shared/components';
import { getUsers } from '@/store/admin/users/users.thunks';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const GetProductActions = ({ fetchTableData, extraParams, setExtraParams }) => {
  // const getOnChange = (name) => (e) => setExtraParams(prev => ({ ...prev, [name]: String(e.target.value).trim(' ') }));
  const getOnChange = (name) => (e) => setExtraParams({ [name]: String(e.target.value).trim(' ') });

  useEffect(() => {
    fetchTableData();
  }, [extraParams]);

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <Grid2 container spacing={2} width={'100%'}>
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UISearchField fullWidth onChange={getOnChange('search')} value={extraParams?.search} />
          </Grid2>
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UIAutocomplete
              name="organizer_id"
              placeholder="Select Organizer"
              fullWidth
              multiple={false}
              control={null}
              url={`users?roles[]=admin&roles[]=light_worker&registration_status=approved`}
              value={extraParams?.organizer_id}
              onChange={(newValue) => {
                setExtraParams({
                  eventId: null,
                  organizer_id: newValue,
                });
              }}
            />
          </Grid2>
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UIAutocomplete
              name="eventId"
              placeholder="Select Group Activities"
              fullWidth
              multiple={false}
              control={null}
              url={
                extraParams?.organizerId
                  ? `events?userId[]=${extraParams?.organizer_id?.value}&registration_status=approved`
                  : `events?registration_status=approved`
              }
              value={extraParams?.eventId}
              onChange={(newValue) => {
                setExtraParams({
                  eventId: newValue,
                });
              }}
            />
          </Grid2>
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <UISelect
              showEmptyOption
              fullWidth
              value={extraParams?.status}
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
    label: 'Refunded',
    value: 'refunded',
  },
  {
    label: 'Fulfilled',
    value: 'fulfilled',
  },
];
