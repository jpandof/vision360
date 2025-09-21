import { useDroppable } from '@dnd-kit/core';
import { DeveloperCard } from './DeveloperCard';
import { useProjectStore, type Project } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { getProjectDevelopers, pendingChanges, developers } =
    useProjectStore();
  const projectDevelopers = getProjectDevelopers(project.id);

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
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          dot: 'bg-emerald-400',
        };
      case 'completado':
        return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' };
      case 'en-pausa':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          dot: 'bg-amber-400',
        };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
    }
  };

  const getDaysToDeadline = () => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProjectProgress = () => {
    const requiredSkillsCount = project.requiredSkills.length;
    const availableSkills = new Set();
    projectDevelopers.forEach(dev => {
      dev.skills.forEach(skill => {
        if (project.requiredSkills.includes(skill)) {
          availableSkills.add(skill);
        }
      });
    });
    return Math.round((availableSkills.size / requiredSkillsCount) * 100);
  };

  const getMissingCriticalSkills = () => {
    const availableSkills = new Set();
    projectDevelopers.forEach(dev => {
      dev.skills.forEach(skill => availableSkills.add(skill));
    });
    return project.requiredSkills.filter(skill => !availableSkills.has(skill));
  };

  const getRecommendedDevelopers = () => {
    const missingSkills = getMissingCriticalSkills();
    if (missingSkills.length === 0) return [];

    const available = developers.filter(
      dev =>
        !projectDevelopers.find(pd => pd.id === dev.id) &&
        dev.status === 'disponible'
    );

    return available
      .map(dev => ({
        ...dev,
        matchingSkills: dev.skills.filter(skill =>
          missingSkills.includes(skill)
        ).length,
      }))
      .filter(dev => dev.matchingSkills > 0)
      .sort((a, b) => b.matchingSkills - a.matchingSkills)
      .slice(0, 2);
  };

  const daysToDeadline = getDaysToDeadline();
  const progress = getProjectProgress();
  const missingSkills = getMissingCriticalSkills();
  const recommended = getRecommendedDevelopers();
  const statusColors = getStatusColor(project.status);

  return (
    <div className="h-full">
      <div
        className={cn(
          'h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col',
          isOver && 'border-blue-400 bg-blue-50'
        )}
      >
        {/* Header más limpio */}
        <div className="p-4 border-b border-gray-100/50">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {project.name}
            </h3>
            <div
              className={`px-2 py-1 rounded-full ${statusColors.bg} flex items-center gap-1`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
              ></div>
              <span className={`text-xs font-medium ${statusColors.text}`}>
                {project.status}
              </span>
            </div>
          </div>

          {/* Métricas visuales limpias */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div
                className={`text-sm font-bold ${
                  daysToDeadline < 7
                    ? 'text-red-500'
                    : daysToDeadline < 30
                      ? 'text-amber-500'
                      : 'text-gray-600'
                }`}
              >
                {daysToDeadline > 0 ? `${daysToDeadline}d` : 'Vencido'}
              </div>
              <div className="text-xs text-gray-500">deadline</div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress >= 80
                        ? 'bg-emerald-400'
                        : progress >= 60
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {progress}%
                </span>
              </div>
              <div className="text-xs text-gray-500">progreso</div>
            </div>

            <div>
              <div className="text-sm font-bold text-gray-700">
                {projectDevelopers.length}
              </div>
              <div className="text-xs text-gray-500">equipo</div>
            </div>
          </div>
        </div>

        {/* Área de desarrolladores */}
        <div ref={setNodeRef} className="flex-1 p-3">
          {projectDevelopers.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-xs">Sin desarrolladores</p>
                <p className="text-xs opacity-70">Arrastra aquí</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {projectDevelopers.map(developer => {
                const pendingInfo = pendingChanges.find(
                  c => c.developerId === developer.id
                );
                return (
                  <DeveloperCard
                    key={developer.id}
                    developer={developer}
                    isPending={!!pendingInfo}
                    pendingFromProject={pendingInfo?.fromProject?.name}
                    pendingToProject={pendingInfo?.toProject?.name}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con alertas importantes */}
        {(missingSkills.length > 0 || recommended.length > 0) && (
          <div className="p-3 bg-gray-50/50 border-t border-gray-100/50 space-y-2">
            {missingSkills.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-500">●</span>
                <span className="text-gray-600">Faltan: </span>
                <span className="font-medium text-red-600">
                  {missingSkills.slice(0, 2).join(', ')}
                  {missingSkills.length > 2 && ` +${missingSkills.length - 2}`}
                </span>
              </div>
            )}
            {recommended.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-500">●</span>
                <span className="text-gray-600">Recomendados: </span>
                <span className="font-medium text-emerald-600">
                  {recommended.map(r => r.name.split(' ')[0]).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
