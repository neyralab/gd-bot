export function anonymizeFullName(str) {
  if (str.length <= 7) {
    return str;
  }
  const start = str.slice(0, 5);
  const end = str.slice(-2);
  const middle = '*'.repeat(str.length - 7);
  return `${start}${middle}${end}`;
}
