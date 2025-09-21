import AdminPanel from './components/AdminPanel';
import './App.css';
import { Toggle } from './components/ui/toggle';
import React from 'react';
import { useProjectStore } from './stores/projectStore';

function Header() {
  const showSimpleView = useProjectStore(state => state.showSimpleView);
  const setShowSimpleView = useProjectStore(state => state.setShowSimpleView);
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-gray-50/50 backdrop-blur-sm border-b border-gray-200/50 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">V</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Vision360</h1>
      </div>
      <Toggle
        pressed={showSimpleView}
        onPressedChange={setShowSimpleView}
        variant="outline"
        size="sm"
        aria-label="Vista simplificada"
        className="bg-white shadow-sm border-gray-200"
      >
        <span className="text-sm">
          {showSimpleView ? '○ Simple' : '● Detallada'}
        </span>
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
