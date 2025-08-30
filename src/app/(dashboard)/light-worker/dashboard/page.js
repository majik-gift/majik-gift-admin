'use client';

import { Box, Grid2, Skeleton, Stack, Typography } from '@mui/material';
import { UICard, ApexChart } from '@/shared/components';
import { useState, useEffect } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';
import GetProductActions from '@/app/(dashboard)/admin/dashboard/actions/get-product-actions';
import ChartHeader from '@/shared/components/chart-header/chart-header';

const LightWorkerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  // const [serviceChartData, setServiceChartData] = useState([]);
  // const [eventChartData, setEventChartData] = useState([]);
  const [chartData, setChartData] = useState({
    products: {
      series: [],
      categories: []
    },
    services: {
      series: [],
      categories: []
    },
    events: {
      series: [],
      categories: []
    },
  })
  const [extraParams, setExtraParams] = useState({ type: 'service' });

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

  const colors = ['#D3AFC9', '#9C90C2', '#000000', '#FF5733', '#33FF57'];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <Box>
      <Grid2 container spacing={3}>
        {loading
          ? // Show skeleton loader while loading
          Array.from(new Array(10)).map((_, index) => (
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
            <ChartHeader setChartData={setChartData} type="services" />
            <ApexChart
              title="Services"
              series={chartData?.services?.series}
              colors={colors}
              categories={chartData?.services?.categories}
            />
          </UICard>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={3} mt={3} pb={3}>
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <UICard sx={{ px: 2, py: 3 }}>
            <ChartHeader setChartData={setChartData} type='events' />
            <ApexChart
              title="Group Activities"
              series={chartData?.events?.series}
              colors={colors}
              categories={chartData?.events?.categories}
            />
          </UICard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default LightWorkerDashboard;


const fieldNames = [
  "product_orders_commission",
  "service_orders_commission",
  "event_tickets_orders_commission",
  'service_orders_sales',
  "ticket_orders_sales",
  "commission_paid",
  "total_sales",
  "commission_get_paid",
  "total_earning"
]