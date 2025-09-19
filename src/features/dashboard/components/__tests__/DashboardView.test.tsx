import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DashboardView } from '../DashboardView'

describe('DashboardView', () => {
  it('renders dashboard title', () => {
    render(<DashboardView />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Bienvenido a tu panel de control principal')).toBeInTheDocument()
  })

  it('renders all stat cards', () => {
    render(<DashboardView />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Growth')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('displays stat values correctly', () => {
    render(<DashboardView />)
    
    expect(screen.getByText('2,543')).toBeInTheDocument()
    expect(screen.getByText('$45,231')).toBeInTheDocument()
    expect(screen.getByText('23.5%')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })
})