import useFilters from "@/hooks/useFilters";
import { UISelect } from "@/shared/components";
import { daysOfWeek } from "@/shared/constant";
import { Stack } from "@mui/material";
import { useParams } from "next/navigation";

const GetTimeSlotsActions = ({ fetchTableData, setExtraParams }) => {
  const { id } = useParams();

  const onFilter = (data) => {
    console.log("🚀 ~ onFilter ~ data:", data);
    setExtraParams(data);
    // fetchTableData({ params: { id, day: data.day } });
    fetchTableData({ extraParams: data });
  };

  const { filters, filtersInArr, updateFilters, clearFilters } = useFilters({
    onFilter,
    initFilters: {
      day: "monday",
    },
  });

  const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(" "));

  return (
    <div>
      <Stack spacing={2} mt="0.8rem" mb="1.2rem" direction="row">
        <UISelect value={filters.day} showEmptyOption={false} onChange={getOnChange("day")} minWidth="7rem" nativeLabel="Days" options={daysOfWeek} />
      </Stack>
    </div>
  );
};

export default GetTimeSlotsActions;
