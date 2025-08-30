import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

const CountryCostInput = ({ data, shippingCost, setShippingCost, errors }) => {
  const alreadyInShippingCost = shippingCost?.find((each) => +each.country_id === data.id);
  const findError = errors?.find((each) => +each.id === data.id);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setShippingCost((prev) => {
      if (checked) {
        // Add the item with an empty cost if it's not already in the array
        return [...prev, { country_id: +value, cost: '' }];
      } else {
        // Remove the item if it exists in the array
        return prev.filter((each) => each.country_id !== +value);
      }
    });
  };

  const handleCostChange = (value) => {
    setShippingCost((prev) =>
      prev.map((each) => (each.country_id === data.id ? { ...each, cost: value } : each))
    );
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <FormControlLabel
        control={
          <Checkbox
            value={data.id}
            checked={Boolean(alreadyInShippingCost)}
            onChange={handleCheckboxChange}
          />
        }
        label={data.name}
      />
      {Boolean(alreadyInShippingCost) && (
        <TextField
          size="small"
          margin="dense"
          type="number"
          placeholder="Shipping amount"
          disabled={!alreadyInShippingCost} // Disable input if the checkbox is unchecked
          error={findError?.cost}
          helperText={findError?.cost}
          value={alreadyInShippingCost?.cost || ''} // Use cost if available, otherwise empty
          onChange={(e) => handleCostChange(e.target.value)} // Update cost on input change
        />
      )}
    </Stack>
  );
};

export default CountryCostInput;
