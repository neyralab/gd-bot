import { sleep } from './sleep';

export const waitTonTx = <T>(getTx: () => Promise<T>) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastTx = await getTx();
      let currentTx = lastTx;
      while (currentTx === lastTx) {
        console.log('waiting for transaction to confirm...', {
          currentTx,
          lastTx
        });
        await sleep(1500);
        currentTx = await getTx();
      }
      console.log({ currentTx });
      resolve(currentTx);
    } catch (e) {
      reject(e);
    }
  });
};