import useFilters from "@/hooks/useFilters";
import { UISearchField } from "@/shared/components";
import { Stack } from "@mui/material";

const GetUsersActions = ({ fetchTableData, setExtraParams }) => {
  const onFilter = (data) => {
    setExtraParams(data);
    fetchTableData({ extraParams: data });
  };

  const { filters, filtersInArr, updateFilters, clearFilters } = useFilters({
    onFilter,
    initFilters: {
      search: "",
    },
  });

  const getOnChange = (name) => (e) => updateFilters(name, e.target.value);

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <UISearchField onChange={getOnChange("search")} value={filters.search} />
      </Stack>
    </div>
  );
};

export default GetUsersActions;
