import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, User } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
}

/**
 * Vista de gestión de usuarios
 * Ejemplo de uso de TanStack Query para data fetching
 */
export const UsersView = () => {
  // Simulamos una API call con TanStack Query
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Datos mock
      return [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
        { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Editor' },
        { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'User' },
      ]
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading users: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.name}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="text-sm font-medium">{user.role}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}