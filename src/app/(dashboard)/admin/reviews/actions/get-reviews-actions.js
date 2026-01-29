import { Stack } from "@mui/material";

import useFilters from "@/hooks/useFilters";
import { UISearchField } from "@/shared/components";

const GetReviewsActions = ({ fetchTableData, setExtraParams }) => {
  const onFilter = (data) => {
    setExtraParams(data);
    fetchTableData({ extraParams: data });
  };

  const { filters, updateFilters } = useFilters({
    onFilter,
    initFilters: {
      search: ""
    }
  });

  const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(" "));

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <UISearchField onChange={getOnChange("search")} value={filters.search} placeholder="Search reviews..." />
      </Stack>
    </div>
  );
};

export default GetReviewsActions;

