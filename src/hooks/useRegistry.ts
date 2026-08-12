import { useRef, useCallback } from 'react';

export function useRegistry<T extends Record<string, any>>() {
  const registryRef = useRef<{ [K in keyof T]: Map<string, T[K]> }>(
    {} as any
  );

  const ensure = useCallback(<K extends keyof T>(type: K) => {
    if (!registryRef.current[type]) {
      registryRef.current[type] = new Map();
    }
  }, []);

  const register = useCallback(
    <K extends keyof T>(type: K, id: string, value: T[K]) => {
      ensure(type);
      registryRef.current[type].set(id, value);
    },
    []
  );

  const unregister = useCallback(
    <K extends keyof T>(type: K, id: string) => {
      registryRef.current[type].delete(id);
    },
    []
  );

  const get = useCallback(
    <K extends keyof T>(type: K, id: string) => {
      return registryRef.current[type].get(id);
    },
    []
  );

  const list = useCallback(
    <K extends keyof T>(type: K) => 
      registryRef.current[type]
    ,
    []
  );

  return {
    registry: registryRef.current,
    register,
    unregister,
    get,
    list,
  };
}
