import { useEffect, useRef, useState } from 'react';
import { useApiRequest } from './useApiRequest';

const useDataTable = ({
  tableApi = null,
  serverPagination = false,
  mapCount = false,
  fetchWithDefaultParams,
  serverSearch = false,
  clientSearchField = '',
  initialExtraParams = {},
}) => {
  const initFetch = useRef(false);
  const fetchedBackup = useRef([]);

  const [search, setSearch] = useState('');
  const isSearchEnabled = Boolean(serverSearch || clientSearchField);

  const [callListApi, loading, error] = useApiRequest(tableApi, {
    initLoading: true,
  });

  const [tableData, setTableData] = useState({
    data: [],
    reason: 'initial-fetch',
  });

  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 20,
    rowCount: 0,
  });

  // Store extra parameters
  const [extraParams, setExtraParams] = useState(initialExtraParams);

  const updateTable = (name, value) => {
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const updatePagination = (name, value) => {
    setPagination((prev) => ({ ...prev, [name]: value }));
  };

  const updateTableData = (data = []) => {
    const addCount = (data) => {
      return data.map((d, i) => ({ ...d, count: i + 1 }));
    };

    updateTable('data', mapCount ? addCount(data) : data);
  };

  const deleteRowHandler = (id, idKey = 'id') => {
    const removeDeletedRow = (data) => {
      return data.filter((tableData) => tableData[idKey] !== id);
    };

    // fetchedBackup.current = removeDeletedRow(fetchedBackup.current);
    updateTableData(removeDeletedRow(tableData.data));
  };

  const fetchTableData = async ({ pagination, search, extraParams = {} } = {}) => {
    if (tableApi) {
      //   const searchParams = serverSearch ? { search: search ?? delayedSearch } : {};
      const params = {
        page: pagination.page + 1,
        perPage: pagination.perPage,
        // ...searchParams,
        ...extraParams, // Merge extraParams
        ...fetchWithDefaultParams,
      };

      const res = await callListApi(params);
      updateTableData(res.details);
      updatePagination('rowCount', res.totalItems);
      // for client side search handling
      initFetch.current = true;
      fetchedBackup.current = res.data;
      return res;
    }
  };

  const commonFetchTableData = ({ extraParams = {} } = {}) => {
    const queries = Object.fromEntries(
      Object.entries(extraParams).map(([key, value]) => [
        key,
        typeof value === 'object' && value !== null ? value?.value : value,
      ])
    );

    return fetchTableData({
      pagination,
      //   search: delayedSearch,
      extraParams: { ...initialExtraParams, ...queries }, // Pass extraParams here
    });
  };
  useEffect(() => {
    commonFetchTableData({ extraParams: extraParams });
  }, [extraParams]);

  const fetchingDetails = {
    loading,
    error,
    list: tableData.data,
    reason: tableData.reason,
  };

  // TABLE PROPS HANDLING

  const onPaginationModelChange = ({ pageSize, page } = {}) => {
    console.log("🚀 ~ onPaginationModelChange ~ pageSize:", pageSize)
    updatePagination('perPage', pageSize);
    updatePagination('page', page);

    if (serverPagination) {
      fetchTableData({
        pagination: {
          perPage: pageSize,
          page,
        },
        extraParams, // Include extraParams when fetching data on pagination change
      });
    }
  };

  const tableProps = {
    paginationModel: {
      pageSize: pagination.perPage,
      page: pagination.page,
    },
    onPaginationModelChange,
    rowCount: pagination.rowCount,
    ...(serverPagination ? { paginationMode: 'server', rowCount: pagination.rowCount } : {}),
  };

  const searchOnChangeHandler = (e) => {
    setSearch(e.target.value);
  };

  const searchProps = isSearchEnabled
    ? {
      onChange: searchOnChangeHandler,
      value: search,
    }
    : {};

  const handleSetExtraParams = (data) => {
    // setExtraParams((prev) => ({ ...prev, ...initialExtraParams, ...data }));
    setExtraParams((prev) => ({ ...prev, ...data }));
  };

  return {
    fetching: fetchingDetails,
    deleteRowHandler,
    tableProps,
    fetchTableData: commonFetchTableData,
    searchProps,
    setExtraParams: handleSetExtraParams, // Expose the setExtraParams function
    extraParams,
  };
};

export default useDataTable;
