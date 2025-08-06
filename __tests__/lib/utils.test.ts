import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'bg-red-500', 'text-white')
      expect(result).toBe('px-2 py-1 bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class', !isActive && 'inactive-class')
      expect(result).toBe('base-class active-class')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['px-2', 'py-1'], 'bg-blue-500')
      expect(result).toBe('px-2 py-1 bg-blue-500')
    })

    it('should handle objects with conditional classes', () => {
      const result = cn('base-class', {
        'active-class': true,
        'inactive-class': false,
        'conditional-class': true
      })
      expect(result).toBe('base-class active-class conditional-class')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle falsy values', () => {
      const result = cn('base-class', false, null, undefined, 0, '')
      expect(result).toBe('base-class')
    })

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('px-2 py-1', 'px-4 py-2')
      expect(result).toBe('px-4 py-2') // Later classes should override earlier ones
    })

    it('should handle complex combinations', () => {
      const isPrimary = true
      const isLarge = false
      const result = cn(
        'button',
        'px-4 py-2 rounded',
        {
          'bg-blue-500 text-white': isPrimary,
          'bg-gray-500 text-gray-900': !isPrimary,
          'text-lg px-6 py-3': isLarge,
          'text-sm': !isLarge
        }
      )
      expect(result).toBe('button px-4 py-2 rounded bg-blue-500 text-white text-sm')
    })
  })
}) 