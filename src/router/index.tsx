import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'

// Lazy loading de features para code splitting
const DashboardView = lazy(() => 
  import('@/features/dashboard/components/DashboardView').then(module => ({
    default: module.DashboardView
  }))
)

const UsersView = lazy(() => 
  import('@/features/users/components/UsersView').then(module => ({
    default: module.UsersView
  }))
)

const SettingsView = lazy(() => 
  import('@/features/settings/components/SettingsView').then(module => ({
    default: module.SettingsView
  }))
)

// Componente de loading para lazy routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Card className="w-64">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Wrapper para Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
)

// Placeholder para Analytics (ejemplo de feature futura)
const AnalyticsView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      <p className="text-muted-foreground">
        Vista de analytics - próximamente
      </p>
    </div>
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          Esta feature está en desarrollo
        </p>
      </CardContent>
    </Card>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <UsersView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'analytics',
        element: <AnalyticsView />,
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsView />
          </SuspenseWrapper>
        ),
      },
    ],
  },
])