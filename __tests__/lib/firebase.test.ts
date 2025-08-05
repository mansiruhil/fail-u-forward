import { firebaseApp } from '@/lib/firebase'

describe('Firebase Initialization', () => {
  it('should initialize Firebase app correctly', () => {
    expect(firebaseApp).toBeDefined()
    expect(firebaseApp).toHaveProperty('options')
    expect(firebaseApp.options).toHaveProperty('apiKey')
    expect(firebaseApp.options).toHaveProperty('authDomain')
    expect(firebaseApp.options).toHaveProperty('projectId')
  })

  it('should have Firebase configuration structure', () => {
    const config = firebaseApp.options
    expect(config).toHaveProperty('apiKey')
    expect(config).toHaveProperty('authDomain')
    expect(config).toHaveProperty('projectId')
    expect(config).toHaveProperty('storageBucket')
    expect(config).toHaveProperty('messagingSenderId')
    expect(config).toHaveProperty('appId')
  })
}) 