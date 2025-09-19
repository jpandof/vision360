import { useStore } from '@nanostores/react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { $sidebarCollapsed, toggleSidebar, addTab } from '@/stores/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  Menu,
  ChevronLeft,
  BarChart3
} from 'lucide-react'

interface NavItem {
  id: string
  title: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: <Home className="h-4 w-4" />
  },
  {
    id: 'users',
    title: 'Users',
    path: '/users',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/analytics',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: <Settings className="h-4 w-4" />
  }
]

/**
 * Sidebar de navegación principal
 * Maneja el estado de colapso y la navegación entre features
 */
export const Sidebar = () => {
  const collapsed = useStore($sidebarCollapsed)
  const location = useLocation()

  const handleNavClick = (item: NavItem) => {
    addTab({
      id: item.id,
      title: item.title,
      path: item.path,
      icon: item.id
    })
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Vision360</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                  collapsed && "justify-center"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4">
        <Separator className="mb-4" />
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <p>Vision360 v1.0.0</p>
            <p>Clean Architecture</p>
          </div>
        )}
      </div>
    </div>
  )
}