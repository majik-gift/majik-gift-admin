import { Grid2, Stack } from '@mui/material';
import { UIAutocomplete, UIButton, UISearchField, UISelect } from '@/shared/components';
import { useEffect, useState } from 'react';

const GetProductActions = ({ fetchTableData, records, loading, handleClientSecret, extraParams, setExtraParams }) => {
  const data = records?.details
  const isUnpaid = data?.length > 0 && data[0]?.commission_fee_status === 'unpaid'
  const isAustralian = data?.length > 0 && data[0]?.organizer_id?.country_code === 'AU'
  const getOnChange = (name) => (e) => setExtraParams(prev => ({ ...prev, [name]: String(e.target.value).trim(' ') }));

  useEffect(() => {
    fetchTableData()
  }, [extraParams])

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <Grid2 container spacing={2} width={'100%'}>

          <Grid2 item size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <UISearchField fullWidth onChange={getOnChange('search')} value={extraParams?.search} />
          </Grid2>

          <Grid2 item size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <UIAutocomplete
              name="eventId"
              placeholder="Select Group Activities"
              fullWidth
              multiple={false}
              control={null}
              url={`events?registration_status=approved`}
              value={extraParams?.eventId}
              onChange={(newValue) => {
                setExtraParams(prev => ({
                  ...prev,
                  eventId: newValue
                }))
              }}
            />
          </Grid2>
          <Grid2 item size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
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
          {records?.details?.length > 0 && !isAustralian && <Grid2 item size={{ xs: 12, sm: 6, md: 3, lg: 3 }} offset={{ lg: 'auto' }}>
            <UIButton sx={{ width: '100%' }} disabled={!isUnpaid} onClick={handleClientSecret} isLoading={loading}>
              {isUnpaid ? `Pay Commission` : `Commission Paid`}
            </UIButton>
          </Grid2>}
        </Grid2>
      </Stack>
    </div >
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
]