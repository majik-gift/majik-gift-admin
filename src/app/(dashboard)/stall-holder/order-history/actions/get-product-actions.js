import { Grid2, Stack } from '@mui/material';
import { UIAutocomplete, UISearchField, UISelect } from '@/shared/components';

const GetProductActions = ({ fetchTableData, extraParams, setExtraParams }) => {

  const getOnChange = (name) => (e) => setExtraParams({ [name]: String(e.target.value).trim(' ') });


  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <Grid2 container spacing={2} width={'100%'}>

          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UISearchField fullWidth onChange={getOnChange('search')} value={extraParams?.search} />
          </Grid2>

          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <UIAutocomplete
              name="productId"
              placeholder="Select Product"
              fullWidth
              multiple={false}
              control={null}
              url={`products?`}
              value={extraParams?.productId}
              onChange={(newValue) => {
                setExtraParams({
                  productId: newValue
                })
              }}
            />
          </Grid2>

          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <UISelect
              showEmptyOption
              value={extraParams?.status}
              fullWidth
              onChange={getOnChange('status')}
              minWidth="7rem"
              nativeLabel="Status"
              options={statusData}
            />
          </Grid2>

        </Grid2>
        {/* <UISelect
          minWidth="7rem"
          value={filters.stallHolderId}
          nativeLabel="Stall Holder"
          onChange={getOnChange('stallHolderId')}
          options={stallHolders}
          isLoading={isLoadingStallHolders}
          /> */}
      </Stack>
    </div>
  );
};

export default GetProductActions;
const statusData = [
  {
    label: 'Delivered',
    value: 'delivered',
  },
  {
    label: 'Paid',
    value: 'completed',
  },
]