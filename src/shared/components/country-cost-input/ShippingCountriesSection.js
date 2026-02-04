'use client';

import { useState } from 'react';
import { Box, Button, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import CountryCostInput from './country-cost-input';

/**
 * Shipping countries section with bulk-add support.
 * - "Add to all countries" applies a default cost to every country
 * - Then edit individual countries as needed
 */
const ShippingCountriesSection = ({
  allCountry,
  shippingCost,
  setShippingCost,
  shippingCostErrors,
}) => {
  const [bulkDefaultCost, setBulkDefaultCost] = useState('10');

  const handleBulkAddAll = () => {
    const cost = parseFloat(bulkDefaultCost);
    if (isNaN(cost) || cost < 0) return;
    setShippingCost(
      allCountry?.map((country) => ({
        country_id: country.id,
        cost: cost,
      })) ?? []
    );
  };

  const handleBulkAddMissing = () => {
    const cost = parseFloat(bulkDefaultCost);
    if (isNaN(cost) || cost < 0) return;
    const existingIds = new Set((shippingCost || []).map((s) => s.country_id));
    const newItems =
      allCountry
        ?.filter((c) => !existingIds.has(c.id))
        .map((country) => ({ country_id: country.id, cost })) ?? [];
    setShippingCost([...(shippingCost || []), ...newItems]);
  };

  const handleClearAll = () => {
    setShippingCost([]);
  };

  const errors = typeof shippingCostErrors === 'string' ? [] : shippingCostErrors;

  return (
    <Stack spacing={2}>
      <Typography fontWeight="800" variant="h5">
        Shipping amount charge to customer
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <TextField
          size="small"
          label="Default cost"
          type="number"
          value={bulkDefaultCost}
          onChange={(e) => setBulkDefaultCost(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          sx={{ width: 120 }}
        />
        <Button variant="outlined" size="small" onClick={handleBulkAddAll}>
          Add to all countries
        </Button>
        <Button variant="text" size="small" onClick={handleBulkAddMissing}>
          Add missing only
        </Button>
        <Button variant="text" size="small" color="secondary" onClick={handleClearAll}>
          Clear all
        </Button>
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
        {allCountry?.map((each) => (
          <CountryCostInput
            data={each}
            key={each.id}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
            errors={errors}
          />
        ))}
      </Stack>
      {typeof shippingCostErrors === 'string' && (
        <FormHelperText sx={{ color: 'error.main' }}>{shippingCostErrors}</FormHelperText>
      )}
    </Stack>
  );
};

export default ShippingCountriesSection;
