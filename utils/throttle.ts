/**
 * Creates a throttled function that only invokes `func` at most once per every `limit` milliseconds.
 * @param func The function to throttle.
 * @param limit The number of milliseconds to throttle invocations to.
 * @returns A new throttled function.
 */
export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): T => {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  } as T;
};
