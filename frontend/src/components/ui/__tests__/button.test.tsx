import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  it('renders as a button element by default', () => {
    render(<Button>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn.tagName).toBe('BUTTON')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies default variant class', () => {
    const { container } = render(<Button>Default</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('bg-purple-600')
  })

  it('applies destructive variant class', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('bg-red-500')
  })

  it('applies outline variant class', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('border')
    expect(btn.className).toContain('bg-white')
  })

  it('applies ghost variant class', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('text-gray-500')
  })

  it('applies sm size class', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('h-8')
  })

  it('applies lg size class', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('h-10')
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="w-full">Full Width</Button>)
    const btn = container.firstChild as HTMLElement
    expect(btn.className).toContain('w-full')
  })

  it('renders with type submit', () => {
    render(<Button type="submit">Submit Form</Button>)
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn.type).toBe('submit')
  })
})
