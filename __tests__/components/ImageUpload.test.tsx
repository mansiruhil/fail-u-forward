import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatePost } from '@/components/post/create-post'

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  orderBy: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn()
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-user-id', email: 'test@test.com' }
  })),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: 'test-user-id', email: 'test@test.com' })
    return jest.fn()
  })
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }))
}))

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

describe('Image Upload Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render image upload button', () => {
    render(<CreatePost />)
    
    const uploadButton = screen.getByText('Upload Image')
    expect(uploadButton).toBeInTheDocument()
  })

  it('should render file input with correct attributes', () => {
    render(<CreatePost />)
    
    const fileInput = document.querySelector('#image-upload')
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('should render post button', () => {
    render(<CreatePost />)
    
    // The button shows "Posting..." when loading/disabled
    const postButton = screen.getByText('Posting...')
    expect(postButton).toBeInTheDocument()
  })

  it('should render textarea for post content', () => {
    render(<CreatePost />)
    
    const textarea = screen.getByPlaceholderText('Share your latest failure...')
    expect(textarea).toBeInTheDocument()
  })

  it('should have required elements for image upload functionality', () => {
    render(<CreatePost />)
    
    // Check that the essential elements exist
    expect(screen.getByText('Upload Image')).toBeInTheDocument()
    expect(screen.getByText('Posting...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Share your latest failure...')).toBeInTheDocument()
  })
}) 