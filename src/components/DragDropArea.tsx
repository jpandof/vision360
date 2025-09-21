import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { UnassignedDevelopers } from './UnassignedDevelopers';
import { ProjectMetrics } from './ProjectMetrics';
import { ProjectHeader } from './ProjectHeader';
import { DeveloperTable } from './DeveloperTable';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type ViewMode = 'projects' | 'table';

export function DragDropArea() {
  const { projects } = useProjectStore();
  const [viewMode, setViewMode] = useState<ViewMode>('projects');

  return (
    <div className="h-screen flex">
      {/* Sidebar de shadcn/ui */}
      <Sidebar className="border-r">
        <SidebarContent className="gap-4">
          {/* Grupo de métricas */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ProjectMetrics />
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Grupo de desarrolladores disponibles - solo mostrar en vista de proyectos */}
          {viewMode === 'projects' && (
            <SidebarGroup className="flex-1">
              <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
                Equipo Disponible
              </SidebarGroupLabel>
              <SidebarGroupContent className="flex-1">
                <UnassignedDevelopers />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>

      {/* Área principal */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Header con navegación entre vistas */}
        <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger />

            {/* Navegación entre vistas */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'projects' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('projects')}
                className="text-sm"
              >
                📊 Proyectos
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="text-sm"
              >
                📋 Tabla de Equipo
              </Button>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              {viewMode === 'projects' ? 'Proyectos' : 'Análisis del Equipo'}
            </h2>
          </div>

          {/* Botones de confirmación - solo en vista de proyectos */}
          {viewMode === 'projects' && <ProjectHeader />}
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'projects' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <DeveloperTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
