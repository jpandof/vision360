import { describe, it, expect, beforeEach } from 'vitest'
import { 
  $activeTabs, 
  $activeTabId, 
  $sidebarCollapsed,
  addTab,
  removeTab,
  setActiveTab,
  toggleSidebar
} from '../navigation'

describe('Navigation Store', () => {
  beforeEach(() => {
    // Reset stores
    $activeTabs.set([])
    $activeTabId.set(null)
    $sidebarCollapsed.set(false)
  })

  describe('addTab', () => {
    it('should add a new tab', () => {
      const tab = { id: 'test', title: 'Test', path: '/test' }
      
      addTab(tab)
      
      expect($activeTabs.get()).toEqual([tab])
      expect($activeTabId.get()).toBe('test')
    })

    it('should not duplicate existing tabs', () => {
      const tab = { id: 'test', title: 'Test', path: '/test' }
      
      addTab(tab)
      addTab(tab)
      
      expect($activeTabs.get()).toHaveLength(1)
      expect($activeTabId.get()).toBe('test')
    })
  })

  describe('removeTab', () => {
    it('should remove a tab', () => {
      const tab1 = { id: 'test1', title: 'Test 1', path: '/test1' }
      const tab2 = { id: 'test2', title: 'Test 2', path: '/test2' }
      
      addTab(tab1)
      addTab(tab2)
      removeTab('test1')
      
      expect($activeTabs.get()).toEqual([tab2])
    })

    it('should set active tab to first remaining when removing active tab', () => {
      const tab1 = { id: 'test1', title: 'Test 1', path: '/test1' }
      const tab2 = { id: 'test2', title: 'Test 2', path: '/test2' }
      
      addTab(tab1)
      addTab(tab2)
      setActiveTab('test1')
      removeTab('test1')
      
      expect($activeTabId.get()).toBe('test2')
    })
  })

  describe('toggleSidebar', () => {
    it('should toggle sidebar state', () => {
      expect($sidebarCollapsed.get()).toBe(false)
      
      toggleSidebar()
      expect($sidebarCollapsed.get()).toBe(true)
      
      toggleSidebar()
      expect($sidebarCollapsed.get()).toBe(false)
    })
  })
})