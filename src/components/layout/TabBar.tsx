import { useStore } from '@nanostores/react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { $activeTabs, $activeTabId, removeTab, setActiveTab } from '@/stores/navigation'
import { X, Home, Users, Settings, BarChart3 } from 'lucide-react'

const iconMap = {
  dashboard: Home,
  users: Users,
  analytics: BarChart3,
  settings: Settings,
}

/**
 * Barra de pestañas para navegación entre features abiertas
 * Permite cerrar pestañas y cambiar entre ellas
 */
export const TabBar = () => {
  const tabs = useStore($activeTabs)
  const activeTabId = useStore($activeTabId)
  const navigate = useNavigate()

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId)
    navigate(path)
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    removeTab(tabId)
    
    // Si cerramos la pestaña activa, navegar a la nueva pestaña activa
    const remainingTabs = tabs.filter(tab => tab.id !== tabId)
    if (remainingTabs.length > 0 && activeTabId === tabId) {
      navigate(remainingTabs[0].path)
    }
  }

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-muted/30 border-b">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id
        const Icon = iconMap[tab.icon as keyof typeof iconMap] || Home
        
        return (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors group",
              isActive 
                ? "bg-background text-foreground shadow-sm" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            <Icon className="h-3 w-3" />
            <span className="max-w-[120px] truncate">{tab.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => handleTabClose(e, tab.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}