import { STORAGE_PREFIX } from '../utils/storageKeys.js'

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getStoredValue(key, fallbackValue) {
  const storage = getStorage()
  if (!storage) return fallbackValue

  try {
    const storedValue = storage.getItem(key)
    return storedValue === null ? fallbackValue : JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

export function setStoredValue(key, value) {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStoredValue(key) {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function clearStoredValues() {
  const storage = getStorage()
  if (!storage) return false

  try {
    const keysToRemove = []

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
    }

    keysToRemove.forEach((key) => storage.removeItem(key))
    return true
  } catch {
    return false
  }
}
