import { ProjectCard } from './ProjectCard';
import { UnassignedDevelopers } from './UnassignedDevelopers';
import { ProjectMetrics } from './ProjectMetrics';
import { ProjectHeader } from './ProjectHeader';
import { useProjectStore } from '@/stores/projectStore';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export function DragDropArea() {
  const { projects } = useProjectStore();

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

          {/* Grupo de desarrolladores disponibles */}
          <SidebarGroup className="flex-1">
            <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
              Equipo Disponible
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex-1">
              <UnassignedDevelopers />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Área principal de proyectos */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Header con trigger del sidebar y botones de confirmación */}
        <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold text-gray-800">Proyectos</h2>
          </div>

          {/* Integrar los botones de confirmación aquí */}
          <ProjectHeader />
        </div>

        {/* Grid de proyectos con scroll habilitado */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
