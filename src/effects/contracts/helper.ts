export async function nullValueCheck<T>(func: () => T): Promise<T | null> {
  try {
    return await func();
  } catch (e) {
    console.error({ nullValueCheckError: e });
    return null;
  }
}
