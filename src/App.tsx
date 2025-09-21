import AdminPanel from './components/AdminPanel';
import './App.css';
import { Toggle } from './components/ui/toggle';
import React from 'react';
import { useProjectStore } from './stores/projectStore';

function Header() {
  const showSimpleView = useProjectStore(state => state.showSimpleView);
  const setShowSimpleView = useProjectStore(state => state.setShowSimpleView);
  return (
    <header className="w-full flex items-center justify-between px-4 py-1 bg-white border-b flex-shrink-0">
      <h1 className="text-lg font-bold">Vision360</h1>
      <Toggle
        pressed={showSimpleView}
        onPressedChange={setShowSimpleView}
        variant="outline"
        size="sm"
        aria-label="Vista simplificada"
      >
        {showSimpleView ? 'Simple' : 'Detallada'}
      </Toggle>
    </header>
  );
}

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <AdminPanel />
      </div>
    </div>
  );
}

export default App;
