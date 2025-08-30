import { useEffect, useState } from "react";

const useFilters = ({ initFilters = {}, onFilter } = {}) => {
  const [filters, setFilters] = useState(initFilters);

  const updateFilters = (key, value) => {
    if (!value) removeFilter(key);
    else {
      const newFilters = { ...filters, [key]: value };
      onFilter(newFilters);
      setFilters(newFilters);
    }
  };

  const clearFilters = () => {
    setFilters(initFilters);
    onFilter(initFilters);
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters, [key]: "" };
    onFilter(newFilters);
    setFilters(newFilters);
  };

  const filtersInArr = Object.entries(filters).flatMap(([key, value]) => {
    return value
      ? [
          {
            key,
            value: value || null,
            label: key,
            onDelete: () => removeFilter(key),
          },
        ]
      : [];
  });
// useEffect(()=>{
// console.log('filtersInArr',filtersInArr)
// },[filtersInArr])
  return { filters, filtersInArr, clearFilters, removeFilter, updateFilters };
};

export default useFilters;
