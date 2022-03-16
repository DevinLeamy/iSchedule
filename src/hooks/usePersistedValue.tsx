import React, { useState, useEffect, Dispatch } from "react";

const defaultSerializer = (value: any) : string => {
  return JSON.stringify(value);
}

const defaultDeserializer = (value: any) : any => {
  return JSON.parse(value);
}

function usePersistedValue<T>(
  defaultValue: T, 
  key: string, 
  options: { serialize?: (value: any) => string, deserialize?: (value: any) => any} = {} 
) : [T, Dispatch<T>] 
{
  const serialize = options.serialize ?? defaultSerializer;
  const deserialize = options.deserialize ?? defaultDeserializer;

  const [value, setValue] = useState<T>(() : T => {
    const persistedValue = window.localStorage.getItem(key);
    return persistedValue !== null ? deserialize(persistedValue) : defaultValue;
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, serialize(value));
  }, [key, value, serialize]);

  return [value, setValue];
}

export { usePersistedValue }
