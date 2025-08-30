import { Grid2, Stack } from '@mui/material';
import useFilters from '@/hooks/useFilters';
import { UISelect, UIDatePicker } from '@/shared/components';
import dayjs from 'dayjs';

const GetProductActions = ({ fetchTableData, setExtraParams, type }) => {
  const onFilter = (data) => {
    const modifiedData = { ...data };
    setExtraParams(modifiedData);
  };

  const { filters, filtersInArr, updateFilters, clearFilters } = useFilters({
    onFilter,
    initFilters: {
      type: 'service',
      from: null,
      to: null,
    },
  });

  const handleDateChange = (name) => (date) => {
    const formattedDate = date ? dayjs(date).format(process.env.NEXT_PUBLIC_DATE_FORMAT) : null;
    updateFilters(name, formattedDate);
  };

  const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(' '));

  return (
    <Grid2 container spacing={2} alignItems="center" marginBottom={4}>
      {/* Select Filter */}
      {type === 'service' && (
        <Grid2 item xs={12} sm={4} md={3}>
          <UISelect
            value={filters.type}
            onChange={getOnChange('type')}
            minWidth="7rem"
            nativeLabel="Type"
            options={[
              {
                label: 'Reading',
                value: 'service',
              },
              {
                label: 'Class',
                value: 'class',
              },
            ]}
          />
        </Grid2>
      )}

      {/* Date Picker  */}
      <Stack direction="row" gap={1} alignItems="center" flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
        <UIDatePicker
          name="from"
          label="From"
          value={filters.from ? dayjs(filters.from) : null}
          onChange={handleDateChange('from')}
          disablePast={false}
        />
        <UIDatePicker
          name="to"
          label="To"
          value={filters.to ? dayjs(filters.to) : null}
          onChange={handleDateChange('to')}
          disabled={!filters.from}
          disablePast={false}
        />
      </Stack>
    </Grid2>
  );
};

export default GetProductActions;
