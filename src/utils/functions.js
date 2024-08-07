export function runFunctionNTimesWithDelay(fn, n, delay) {
  for (let i = 0; i < n; i++) {
    setTimeout(fn, i * delay);
  }
}
