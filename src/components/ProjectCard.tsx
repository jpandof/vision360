import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  // Calcular días hasta deadline
  const getDaysToDeadline = () => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calcular progreso estimado basado en skills
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

  // Calcular carga de trabajo promedio
  const getWorkloadInfo = () => {
    const totalDevs = projectDevelopers.length;
    if (totalDevs === 0) return { avg: 0, status: 'empty' };

    // Simular carga basada en skills match y tamaño del equipo
    const avgWorkload = Math.min(
      100,
      (project.requiredSkills.length / totalDevs) * 25
    );

    if (totalDevs > 6)
      return { avg: Math.round(avgWorkload * 1.3), status: 'overloaded' };
    if (totalDevs < 2)
      return { avg: Math.round(avgWorkload * 1.5), status: 'understaffed' };
    return { avg: Math.round(avgWorkload), status: 'balanced' };
  };

  // Determinar estado de salud del proyecto
  const getProjectHealth = () => {
    const daysToDeadline = getDaysToDeadline();
    const progress = getProjectProgress();
    const workload = getWorkloadInfo();

    if (daysToDeadline < 7 && progress < 80) return 'critical';
    if (workload.status === 'overloaded' || workload.status === 'empty')
      return 'warning';
    if (daysToDeadline < 30 && progress < 60) return 'warning';
    return 'healthy';
  };

  // Calcular skills faltantes críticos
  const getMissingCriticalSkills = () => {
    const availableSkills = new Set();
    projectDevelopers.forEach(dev => {
      dev.skills.forEach(skill => availableSkills.add(skill));
    });
    return project.requiredSkills.filter(skill => !availableSkills.has(skill));
  };

  // Buscar desarrolladores recomendados para skills faltantes
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
  const health = getProjectHealth();
  const workload = getWorkloadInfo();
  const missingSkills = getMissingCriticalSkills();
  const recommended = getRecommendedDevelopers();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{project.name}</CardTitle>
          <div className="flex gap-1">
            <Badge
              className={getStatusColor(project.status)}
              style={{ fontSize: '10px', padding: '1px 4px' }}
            >
              {project.status}
            </Badge>
            {health === 'critical' && (
              <span className="text-red-600 text-xs">🚨</span>
            )}
            {health === 'warning' && (
              <span className="text-yellow-600 text-xs">⚠️</span>
            )}
            {workload.status === 'overloaded' && (
              <span className="text-orange-600 text-xs">📊</span>
            )}
          </div>
        </div>

        {/* Información crítica en una línea */}
        <div className="flex items-center justify-between text-xs">
          <span
            className={`font-medium ${
              daysToDeadline < 7
                ? 'text-red-600'
                : daysToDeadline < 30
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}
          >
            {daysToDeadline > 0 ? `${daysToDeadline}d` : 'Vencido'}
          </span>

          <div className="flex items-center gap-1">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progress >= 80
                    ? 'bg-green-500'
                    : progress >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-medium text-xs">{progress}%</span>
          </div>

          <span
            className={`font-medium text-xs ${
              workload.status === 'overloaded'
                ? 'text-orange-600'
                : workload.status === 'empty'
                  ? 'text-red-600'
                  : workload.status === 'understaffed'
                    ? 'text-yellow-600'
                    : 'text-green-600'
            }`}
          >
            {projectDevelopers.length} devs
          </span>
        </div>

        {/* Alertas críticas */}
        {(missingSkills.length > 0 || recommended.length > 0) && (
          <div className="text-xs space-y-0.5">
            {missingSkills.length > 0 && (
              <div className="text-red-600">
                ❌ Faltan: {missingSkills.slice(0, 2).join(', ')}
                {missingSkills.length > 2 && ` +${missingSkills.length - 2}`}
              </div>
            )}
            {recommended.length > 0 && (
              <div className="text-green-600">
                💡 Recomendados:{' '}
                {recommended.map(r => r.name.split(' ')[0]).join(', ')}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Drop zone optimizado */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 p-1 border-2 border-dashed border-gray-200 rounded-lg transition-colors overflow-auto',
            isOver && 'border-blue-400 bg-blue-50'
          )}
        >
          {projectDevelopers.length === 0 ? (
            <div className="flex items-center justify-center h-16 text-muted-foreground">
              <div className="text-center">
                <p className="text-xs">Sin desarrolladores</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {projectDevelopers.map(developer => {
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

        {/* Skills footer ultra compacto */}
        <div className="mt-1 flex-shrink-0">
          <div className="flex flex-wrap gap-0.5">
            {project.requiredSkills.slice(0, 6).map(skill => {
              const hasSkill = projectDevelopers.some(dev =>
                dev.skills.includes(skill)
              );
              return (
                <span
                  key={skill}
                  className={`px-1 py-0.5 text-xs rounded text-xs ${
                    hasSkill
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  style={{ fontSize: '9px' }}
                >
                  {hasSkill ? '✓' : '✗'} {skill.slice(0, 3)}
                </span>
              );
            })}
            {project.requiredSkills.length > 6 && (
              <span
                className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded"
                style={{ fontSize: '9px' }}
              >
                +{project.requiredSkills.length - 6}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
