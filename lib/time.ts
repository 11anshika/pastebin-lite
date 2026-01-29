export function getNow(headers: Headers): number {
  if (process.env.TEST_MODE === '1') {
    const testTime = headers.get('x-test-now-ms');
    if (testTime) return parseInt(testTime, 10);
  }
  return Date.now();
}