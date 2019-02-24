export function promisify<T>(method: Function) {
  return new Promise<T>((resolve, reject) => {
    method((error: Error, result: T) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
