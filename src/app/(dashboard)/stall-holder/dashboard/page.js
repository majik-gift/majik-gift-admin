'use client';

import { Box, Grid2, Skeleton, Stack, Typography } from '@mui/material';
import { UICard, ApexChart } from '@/shared/components';
import { useState, useEffect } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';
import GetProductActions from '@/app/(dashboard)/admin/dashboard/actions/get-product-actions';

const StallHolder = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [productChartData, setProductChartData] = useState([]);
  const [extraParams, setExtraParams] = useState({});

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('auth/dashboard-stats');
      setDashboardStats(data.response.details);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductChartData = async () => {
    setLoading(true);
    try {
      let url = `auth/order-product-dashboard`;
      if (extraParams.to && extraParams.from) {
        url += `?from=${extraParams.from}&to=${extraParams.to}`;
      }
      const { data } = await axiosInstance.get(url);
      setProductChartData(data.response.details);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseChartData = (orders) => {
    if (!orders) return { series: [], categories: [] };

    const series = orders.map((order) => ({
      name: order.name || 'Unnamed',
      data: order.data || [],
    }));

    const categories = orders[0]?.categories || [];
    return { series, categories };
  };

  const productsChartData = parseChartData(productChartData);
  const colors = ['#D3AFC9', '#9C90C2', '#000000', '#FF5733', '#33FF57'];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchProductChartData();
  }, [extraParams]);

  return (
    <Box>
      <Grid2 container spacing={3}>
        {loading
          ? // Show skeleton loader while loading
          Array.from(new Array(8)).map((_, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <UICard sx={{ px: 2, py: 3 }}>
                <Stack>
                  <Skeleton variant="text" width={100} height={40} />
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={60}
                    sx={{ alignSelf: 'flex-end' }}
                  />
                </Stack>
              </UICard>
            </Grid2>
          ))
          : // Render data if available
          dashboardStats &&
          Object.entries(dashboardStats).map(([key, value]) => (
            <Grid2 key={key} size={{ xs: 12, sm: 6, md: 4 }}>
              <UICard sx={{ px: 2, py: 3 }}>
                <Stack>
                  <Typography variant="h6" textTransform="capitalize">
                    {key.replace(/_/g, ' ')}{' '}
                  </Typography>
                  <Typography variant="h3" alignSelf="flex-end">
                    {fieldNames.includes(key) && `$`}{value}
                  </Typography>
                </Stack>
              </UICard>
            </Grid2>
          ))}
      </Grid2>

      {/* Charts */}
      <Grid2 container spacing={3} mt={3} pb={3}>
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <UICard sx={{ px: 2, py: 3 }}>
            <GetProductActions setExtraParams={setExtraParams} />
            <ApexChart
              title="Products"
              series={productsChartData?.series}
              colors={colors}
              categories={productsChartData?.categories}
            />
          </UICard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default StallHolder;



const fieldNames = [
  "product_orders_sales",
  "product_orders_commission",
  "total_sales",
  "total_earning"
]