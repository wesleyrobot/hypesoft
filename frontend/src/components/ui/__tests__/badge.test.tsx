import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>In Stock</Badge>)
    expect(screen.getByText('In Stock')).toBeDefined()
  })

  it('renders with default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-purple-100')
    expect(badge.className).toContain('text-purple-700')
  })

  it('renders success variant with correct classes', () => {
    const { container } = render(<Badge variant="success">Active</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-green-50')
    expect(badge.className).toContain('text-green-600')
  })

  it('renders destructive variant with correct classes', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-red-50')
    expect(badge.className).toContain('text-red-600')
  })

  it('renders warning variant with correct classes', () => {
    const { container } = render(<Badge variant="warning">Low Stock</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-yellow-50')
    expect(badge.className).toContain('text-yellow-600')
  })

  it('renders secondary variant with correct classes', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-gray-100')
  })

  it('renders outline variant with border class', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('border')
  })

  it('applies extra className', () => {
    const { container } = render(<Badge className="my-custom-class">Tag</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('my-custom-class')
  })

  it('passes through other html attributes', () => {
    render(<Badge data-testid="my-badge">Badge</Badge>)
    expect(screen.getByTestId('my-badge')).toBeDefined()
  })
})
