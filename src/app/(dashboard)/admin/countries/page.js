'use client';

import { ApiLoader, UICard, UISearchField } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import getCountryColumnHeader from './column-header';

const GetAllCountries = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(''); // State to hold search query
  const { addToast } = useToast();

  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 20,
    rowCount: 0,
  });

  // Function to fetch records with optional search
  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const url = `country?status=all&page=${pagination.page + 1}&perPage=${pagination.perPage}&search=${search}`;
      const response = await axiosInstance.get(url);
      setRecords(response.data.response); // Assuming the API returns a `data.response` structure
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error?.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setIsLoading(true);
      await axiosInstance.patch(`country/${id}`, { status: newStatus });

      // Optimistically update the local state
      setRecords((prevRecords) => {
        const updatedDetails = prevRecords.details.map((record) =>
          record.id === id ? { ...record, status: newStatus } : record
        );
        return { ...prevRecords, details: updatedDetails };
      });

      addToast({
        severity: 'success',
        message: `Country status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        severity: 'error',
        message: 'Failed to update country status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update search state and reset pagination when the user types
  const handleSearchChange = (value) => {
    setSearch(value.target.value);
    setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page
  };

  useEffect(() => {
    getAllActivities();
  }, [pagination, search]); // Fetch data whenever pagination or search changes

  let tableColumn = getCountryColumnHeader({
    onStatusChange: handleStatusChange,
  });

  return (
    <div>
      <UICard pageHeight backButton heading="Countries">
        <ApiLoader error={error}>
          <Stack spacing={2} mt="0.3rem" mb="1.2rem" direction="row">
            {/* Search Field */}
            <UISearchField
              onChange={handleSearchChange} // Directly pass the handler
              value={search}
              placeholder="Search countries..."
            />
          </Stack>

          <UITable
            tableData={records?.details}
            loading={isLoading}
            tableColumns={tableColumn}
            paginationModel={{
              pageSize: pagination.perPage,
              page: pagination.page,
            }}
            paginationMode="server"
            onPaginationModelChange={({ pageSize, page }) => {
              setPagination({ page, perPage: pageSize });
            }}
            rowCount={records.totalItems}
          />
        </ApiLoader>
      </UICard>
    </div>
  );
};

export default GetAllCountries;
