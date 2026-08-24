import { useEffect, useState } from 'react'

import { getStoredValue, setStoredValue } from '../services/storage'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getStoredValue(key, initialValue))

  useEffect(() => {
    setStoredValue(key, value)
  }, [key, value])

  return [value, setValue]
}
