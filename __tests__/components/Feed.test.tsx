import { render, screen } from '@testing-library/react'
import { Feed } from '@/components/feed/feed'

describe('Feed Component', () => {
  it('renders without crashing', () => {
    render(<Feed />)
    expect(screen.getByText('Share Failure')).toBeInTheDocument()
  })

  it('contains CreatePost component', () => {
    render(<Feed />)
    // The CreatePost component should be rendered
    expect(screen.getByText('Share Failure')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<Feed />)
    const feedContainer = screen.getByText('Share Failure').closest('div')?.parentElement?.parentElement
    expect(feedContainer).toHaveClass('max-w-2xl', 'mx-auto', 'pt-4')
  })
}) 