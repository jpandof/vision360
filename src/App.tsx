import AdminPanel from './components/AdminPanel';
import './App.css';
import { Toggle } from './components/ui/toggle';
import React from 'react';
import { useProjectStore } from './stores/projectStore';

function Header() {
  const showSimpleView = useProjectStore(state => state.showSimpleView);
  const setShowSimpleView = useProjectStore(state => state.setShowSimpleView);
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b mb-4">
      <h1 className="text-2xl font-bold">Vision360</h1>
      <Toggle
        pressed={showSimpleView}
        onPressedChange={setShowSimpleView}
        variant="outline"
        size="sm"
        aria-label="Vista simplificada"
      >
        {showSimpleView ? 'Simplificada' : 'Detallada'}
      </Toggle>
    </header>
  );
}

function App() {
  return (
    <>
      <Header />
      <AdminPanel />
    </>
  );
}

export default App;
