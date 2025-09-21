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
    <div className="h-full flex gap-2">
      {/* Panel lateral compacto y collapsable */}
      <div
        className={`${sidebarCollapsed ? 'w-12' : 'w-56'} flex-shrink-0 flex flex-col gap-2 transition-all duration-300`}
      >
        {/* Botón de collapse */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-full"
        >
          {sidebarCollapsed ? '→' : '←'}
        </Button>

        {!sidebarCollapsed && (
          <>
            {/* Métricas principales - ultra compacto */}
            <ProjectMetrics />

            {/* Desarrolladores disponibles - más compacto */}
            <div className="flex-1 min-h-0">
              <UnassignedDevelopers />
            </div>
          </>
        )}
      </div>

      {/* Área principal de proyectos - usa todo el espacio restante */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 h-full">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
