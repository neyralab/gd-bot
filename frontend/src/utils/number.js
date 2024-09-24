function formatLargeNumberExtended(num) {
  const units = ['', 'K', 'M', 'B', 'T', 'Q'];
  const k = 1000;
  const magnitude = Math.floor(Math.log(num) / Math.log(k));
  
  if (magnitude >= units.length) {
      return num.toString();
  }
  
  const result = (num / Math.pow(k, magnitude)).toFixed(1);
  return result.endsWith('.0') ? result.slice(0, -2) + units[magnitude] : result + units[magnitude];
}

export { formatLargeNumberExtended }