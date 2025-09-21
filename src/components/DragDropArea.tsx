import { ProjectCard } from './ProjectCard';
import { UnassignedDevelopers } from './UnassignedDevelopers';
import { ProjectMetrics } from './ProjectMetrics';
import { useProjectStore } from '@/stores/projectStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function DragDropArea() {
  const { projects } = useProjectStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-full flex gap-6 p-6 bg-gray-50/30">
      {/* Panel lateral rediseñado */}
      <div
        className={`${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 flex flex-col gap-6 transition-all duration-300`}
      >
        {/* Botón de collapse más elegante */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-10 bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:bg-white/90"
        >
          {sidebarCollapsed ? (
            <span className="text-gray-600">→</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">←</span>
              <span className="text-sm text-gray-600">Colapsar</span>
            </div>
          )}
        </Button>

        {!sidebarCollapsed && (
          <>
            {/* Métricas principales */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Dashboard
              </h3>
              <ProjectMetrics />
            </div>

            {/* Desarrolladores disponibles */}
            <div className="flex-1 min-h-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Equipo Disponible
              </h3>
              <UnassignedDevelopers />
            </div>
          </>
        )}
      </div>

      {/* Área principal de proyectos */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Proyectos
          </h2>
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
