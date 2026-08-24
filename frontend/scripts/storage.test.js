import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import {
  clearStoredValues,
  getStoredValue,
  removeStoredValue,
  setStoredValue,
} from '../src/services/storage.js'

class MemoryStorage {
  #values = new Map()

  get length() {
    return this.#values.size
  }

  getItem(key) {
    return this.#values.get(key) ?? null
  }

  setItem(key, value) {
    this.#values.set(key, value)
  }

  removeItem(key) {
    this.#values.delete(key)
  }

  key(index) {
    return [...this.#values.keys()][index] ?? null
  }
}

describe('storage service', () => {
  afterEach(() => {
    delete globalThis.window
  })

  it('guarda, lee y elimina valores JSON', () => {
    globalThis.window = { localStorage: new MemoryStorage() }

    assert.equal(setStoredValue('focusmind:test', { enabled: true }), true)
    assert.deepEqual(getStoredValue('focusmind:test', null), { enabled: true })
    assert.equal(removeStoredValue('focusmind:test'), true)
    assert.equal(getStoredValue('focusmind:test', 'fallback'), 'fallback')
  })

  it('devuelve el valor alternativo si encuentra JSON inválido', () => {
    const localStorage = new MemoryStorage()
    const fallbackValue = []
    localStorage.setItem('focusmind:invalid', '{invalid')
    globalThis.window = { localStorage }

    assert.equal(getStoredValue('focusmind:invalid', fallbackValue), fallbackValue)
  })

  it('limpia solo las claves propias de FocusMind', () => {
    const localStorage = new MemoryStorage()
    localStorage.setItem('focusmind:subjects', '[]')
    localStorage.setItem('other-app:settings', '{}')
    globalThis.window = { localStorage }

    assert.equal(clearStoredValues(), true)
    assert.equal(localStorage.getItem('focusmind:subjects'), null)
    assert.equal(localStorage.getItem('other-app:settings'), '{}')
  })

  it('funciona sin acceso a localStorage', () => {
    assert.equal(getStoredValue('focusmind:test', 'fallback'), 'fallback')
    assert.equal(setStoredValue('focusmind:test', 'value'), false)
    assert.equal(removeStoredValue('focusmind:test'), false)
    assert.equal(clearStoredValues(), false)
  })
})
