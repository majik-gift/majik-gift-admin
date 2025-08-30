export function formatNumber(value) {
  if (value !== null && value !== undefined) {
    let newValue = +value
    if (Number.isInteger(newValue)) {
      return newValue;
    } else {
      return newValue.toFixed(2);
    }
  } else {
    return 0
  }
}