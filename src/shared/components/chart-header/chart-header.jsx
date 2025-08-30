import { Grid2, Stack } from '@mui/material';
import useFilters from '@/hooks/useFilters';
import { UISelect, UIDatePicker } from '@/shared/components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import axiosInstance from '@/shared/services/axiosInstance';

const ChartHeader = ({ setChartData, type }) => {
    const [extraParams, setExtraParams] = useState({})
    const [isLoading, setIsLoading] = useState({
        products: false,
        services: false,
        events: false
    })
    const onFilter = (data) => {
        const modifiedData = { ...data };
        setExtraParams(modifiedData);
    };

    const { filters, filtersInArr, updateFilters, clearFilters } = useFilters({
        onFilter,
        initFilters: {
            type: 'service',
            from: null,
            to: null,
        },
    });

    const parseChartData = (orders) => {
        if (!orders) return { series: [], categories: [] };
        let categories = []

        const series = orders.map((order) => ({
            name: order.name || 'Unnamed',
            data: order.data || [],
        }));

        const allCategories = [...new Set(orders.flatMap(order => order.categories))];
        const currentYear = new Date().getFullYear();
        const parsedDates = allCategories.map(date => new Date(`${date} ${currentYear}`));
        // Sort the dates
        parsedDates.sort((a, b) => a - b);
        // Convert back to original format
        const sortedDates = parsedDates.map(date =>
            date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        );
        return { series, categories: sortedDates };
    };

    const fetchChartData = async (type) => {
        setIsLoading(prev => ({ ...prev, [type]: true }))
        try {
            let url = apiRoute[type]
            if (filters.from && filters.to) url += `?from=${filters.from}&to=${filters.to}`;
            if (type === 'services') url += `?type=${filters.type}`
            const { data } = await axiosInstance.get(url);

            setChartData(prev => ({ ...prev, [type]: parseChartData(data?.response?.details) }))
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(prev => ({ ...prev, [type]: false }))
        }
    };

    useEffect(() => {
        fetchChartData(type)
    }, [filters])



    const handleDateChange = (name) => (date) => {
        const formattedDate = date ? dayjs(date).format(process.env.NEXT_PUBLIC_DATE_FORMAT) : null;
        updateFilters(name, formattedDate);
    };

    const getOnChange = (name) => (e) => updateFilters(name, String(e.target.value).trim(' '));

    return (
        <Grid2 container spacing={2} alignItems="center" marginBottom={4}>
            {/* Select Filter */}
            {type === 'services' && (
                <Grid2 item xs={12} sm={4} md={3}>
                    <UISelect
                        value={filters.type}
                        onChange={getOnChange('type')}
                        minWidth="7rem"
                        nativeLabel="Type"
                        options={[
                            {
                                label: 'Reading',
                                value: 'service',
                            },
                            {
                                label: 'Class',
                                value: 'class',
                            },
                        ]}
                    />
                </Grid2>
            )}

            {/* Date Picker  */}
            <Stack direction="row" gap={1} alignItems="center" flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
                <UIDatePicker
                    name={`from`}
                    label="From"
                    value={filters.from ? dayjs(filters.from) : null}
                    onChange={handleDateChange(`from`)}
                    disablePast={false}
                />
                <UIDatePicker
                    name={`${[type]}to`}
                    label="To"
                    disableFuture
                    value={filters.to ? dayjs(filters.to) : null}
                    onChange={handleDateChange(`to`)}
                    disabled={!filters.from}
                    disablePast={false}
                />
            </Stack>
        </Grid2>
    );
};

export default ChartHeader;


const apiRoute = {
    products: `auth/order-product-dashboard`,
    events: `auth/event-ticket-order-dashboard`,
    services: `auth/service-order-dashboard`
}