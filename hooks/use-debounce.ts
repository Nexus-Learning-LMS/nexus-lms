// this hook provides a debounced value of the input, 
// useful for search inputs or other scenarios where you want to limit the frequency of updates
// This way we can avoid making too many requests to the server when the user is typing

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

