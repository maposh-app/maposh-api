// tslint:disable-next-line:ban-types
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

export function union<T>(...iterables: Array<Set<T>>): Set<T> {
  const set = new Set<T>();
  iterables.forEach(iterable => {
    iterable.forEach(item => set.add(item));
  });
  return set;
}

export function difference<T>(minuend: Set<T>, subtrahend: Set<T>) {
  const set = new Set<T>(
    Array.from(minuend).filter(item => !subtrahend.has(item))
  );
  return set;
}
