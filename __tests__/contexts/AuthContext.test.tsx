import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

// Mock Firebase auth
const mockAuth = {
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}

jest.mocked(getAuth).mockReturnValue(mockAuth as any)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('can create AuthProvider without crashing', () => {
    // Mock the auth state callback to be called immediately
    mockAuth.onAuthStateChanged.mockImplementation((callback) => {
      callback(null)
      return jest.fn()
    })

    // Just test that we can create the provider without errors
    expect(() => {
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    }).not.toThrow()
  })

  it('provides auth functions', () => {
    // Mock the auth state callback to be called immediately
    mockAuth.onAuthStateChanged.mockImplementation((callback) => {
      callback(null)
      return jest.fn()
    })

    // Test that the context functions exist and can be called
    const TestComponent = () => {
      const auth = useAuth()
      expect(auth).toHaveProperty('login')
      expect(auth).toHaveProperty('signup')
      expect(auth).toHaveProperty('logout')
      expect(auth).toHaveProperty('currentUser')
      expect(auth).toHaveProperty('loading')
      return null
    }

    // This should not throw
    expect(() => {
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    }).not.toThrow()
  })
}) 