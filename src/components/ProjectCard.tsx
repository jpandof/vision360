import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeveloperCard } from './DeveloperCard';
import { useProjectStore, type Project } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { getProjectDevelopers, pendingChanges } = useProjectStore();
  const developers = getProjectDevelopers(project.id);

  const { isOver, setNodeRef } = useDroppable({
    id: project.id,
    data: {
      type: 'project',
      project,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-500 text-white';
      case 'completado':
        return 'bg-blue-500 text-white';
      case 'en-pausa':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPendingChangeInfo = (developerId: string) => {
    const change = pendingChanges.find(c => c.developerId === developerId);
    if (!change) return null;

    return {
      isPending: true,
      fromProject: change.fromProject?.name,
      toProject: change.toProject?.name,
    };
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Deadline: {project.deadline}
          </span>
          <span className="text-muted-foreground">
            {developers.length} devs
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Drop zone */}
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-[180px] p-4 border-2 border-dashed border-gray-200 rounded-lg transition-colors',
            isOver && 'border-blue-400 bg-blue-50'
          )}
        >
          {developers.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">Sin desarrolladores asignados</p>
                <p className="text-xs">Arrastra desarrolladores aquí</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {developers.map(developer => {
                const pendingInfo = getPendingChangeInfo(developer.id);
                return (
                  <DeveloperCard
                    key={developer.id}
                    developer={developer}
                    isPending={pendingInfo?.isPending}
                    pendingFromProject={pendingInfo?.fromProject}
                    pendingToProject={pendingInfo?.toProject}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Required skills */}
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Skills requeridas:
          </p>
          <div className="flex flex-wrap gap-1">
            {project.requiredSkills.map(skill => (
              <span
                key={skill}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1">
            Ver detalles
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
