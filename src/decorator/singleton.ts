/* eslint-disable @typescript-eslint/no-explicit-any */
export type ClassConstructor<T> = new (...args: any[]) => T;


export function Singleton<T extends ClassConstructor<any>>() {
  return function (target: T): T {
    let instance: T | null = null;
    return class {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }
        instance = new target(...args);
        return instance as T;
      }
    } as T
  }
}