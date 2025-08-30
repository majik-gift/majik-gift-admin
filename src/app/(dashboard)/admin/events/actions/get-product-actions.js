import { Stack } from '@mui/material';

import useFilters from '@/hooks/useFilters';
import { UISearchField, UISelect } from '@/shared/components';

const GetProductActions = ({ fetchTableData, setExtraParams }) => {
  const onFilter = (data) => {
    const modifiedData = { ...data };

    if (data.is_joined === 'all') {
      delete modifiedData.is_joined;
    }

    setExtraParams(modifiedData);
    fetchTableData({ extraParams: modifiedData });
  };

  const { filters, filtersInArr, updateFilters, clearFilters } = useFilters({
    onFilter,
    initFilters: {
      registration_status: 'all',
      search: '',
      is_joined: 'all',
    },
  });

  const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(' '));

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <UISearchField onChange={getOnChange('search')} value={filters.search} />
        <UISelect
          showEmptyOption
          value={filters.registration_status}
          onChange={getOnChange('registration_status')}
          minWidth="7rem"
          nativeLabel="Status"
          options={[
            {
              label: 'Approved',
              value: 'approved',
            },
            {
              label: 'Rejected',
              value: 'rejected',
            },
            {
              label: 'Pending',
              value: 'pending',
            },
          ]}
        />
        <UISelect
          showEmptyOption
          value={filters.is_joined}
          onChange={getOnChange('is_joined')}
          minWidth="7rem"
          nativeLabel="Participants"
          options={[
            {
              label: 'Joined',
              value: 'true',
            },
          ]}
        />
      </Stack>
    </div>
  );
};

export default GetProductActions;
