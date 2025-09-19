import { atom } from 'nanostores'

export interface Tab {
  id: string
  title: string
  path: string
  icon?: string
}

export const $activeTabs = atom<Tab[]>([])
export const $activeTabId = atom<string | null>(null)
export const $sidebarCollapsed = atom<boolean>(false)

// Actions
export const addTab = (tab: Tab) => {
  const currentTabs = $activeTabs.get()
  const existingTab = currentTabs.find(t => t.id === tab.id)
  
  if (!existingTab) {
    $activeTabs.set([...currentTabs, tab])
  }
  
  $activeTabId.set(tab.id)
}

export const removeTab = (tabId: string) => {
  const currentTabs = $activeTabs.get()
  const updatedTabs = currentTabs.filter(tab => tab.id !== tabId)
  $activeTabs.set(updatedTabs)
  
  // Si cerramos la pestaña activa, activar la primera disponible
  if ($activeTabId.get() === tabId) {
    $activeTabId.set(updatedTabs.length > 0 ? updatedTabs[0].id : null)
  }
}

export const setActiveTab = (tabId: string) => {
  $activeTabId.set(tabId)
}

export const toggleSidebar = () => {
  $sidebarCollapsed.set(!$sidebarCollapsed.get())
}