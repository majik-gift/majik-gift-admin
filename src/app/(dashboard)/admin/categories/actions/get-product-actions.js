import { Stack } from "@mui/material";

import useFilters from "@/hooks/useFilters";
import { UISearchField, UISelect } from "@/shared/components";

const GetProductActions = ({ fetchTableData, setExtraParams }) => {
  const onFilter = (data) => {
    setExtraParams(data);
    fetchTableData({ extraParams: data });
  };

  const { filters,  updateFilters, } = useFilters({
    onFilter,
    initFilters:{
      type: "all",
      search: ""
    }
  });

  const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(" "));

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <UISearchField onChange={getOnChange("search")} value={filters.search} />
        <UISelect
          value={filters.type}
          onChange={getOnChange("type")}
          minWidth="7rem"
          nativeLabel="Category"
          showEmptyOption
          options={[
            {
              label: "Group Activities",
              value: "event_category",
            },
            {
              label: "Service",
              value: "service_category",
            },
            {
              label: "Product",
              value: "product_category",
            },
          ]}
        />
      </Stack>
    </div>
  );
};

export default GetProductActions;
