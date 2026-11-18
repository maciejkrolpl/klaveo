import { useEffect, useState } from 'react'
import { load, save } from '../storage'

/** useState for one of a fixed set of string values, remembered in localStorage. */
export function usePersistedChoice<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
) {
  const [value, setValue] = useState<T>(() => load(key, allowed, fallback))
  useEffect(() => save(key, value), [key, value])
  return [value, setValue] as const
}
