import { ProjectCard } from './ProjectCard';
import { UnassignedDevelopers } from './UnassignedDevelopers';
import { useProjectStore } from '@/stores/projectStore';

export function DragDropArea() {
  const { projects } = useProjectStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Desarrolladores disponibles */}
      <div className="lg:col-span-1">
        <UnassignedDevelopers />
      </div>

      {/* Proyectos */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
