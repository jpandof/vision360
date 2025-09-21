import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type Developer } from '@/stores/projectStore';
import { cn } from '@/lib/utils';
import { type DraggableAttributes } from '@dnd-kit/core';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useProjectStore } from '@/stores/projectStore';

interface DetailedDeveloperViewProps {
  developer: Developer;
  isPending?: boolean;
  pendingFromProject?: string;
  pendingToProject?: string;
  isDragging?: boolean;
  setNodeRef: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
  listeners?: SyntheticListenerMap | undefined;
  attributes?: DraggableAttributes;
}

export function DetailedDeveloperView({
  developer,
  isPending = false,
  pendingFromProject,
  pendingToProject,
  isDragging = false,
  setNodeRef,
  style,
  listeners,
  attributes,
}: DetailedDeveloperViewProps) {
  const { projects } = useProjectStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-500';
      case 'disponible':
        return 'bg-gray-500';
      case 'vacaciones':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener información del proyecto actual
  const currentProject = projects.find(project =>
    project.developerIds.includes(developer.id)
  );

  // Calcular compatibilidad con skills del proyecto
  const getSkillsCompatibility = () => {
    if (!currentProject) return null;
    const matchingSkills = developer.skills.filter(skill =>
      currentProject.requiredSkills.includes(skill)
    );
    return {
      matching: matchingSkills.length,
      total: currentProject.requiredSkills.length,
      percentage: Math.round(
        (matchingSkills.length / currentProject.requiredSkills.length) * 100
      ),
      matchingSkillsList: matchingSkills,
    };
  };

  const skillsCompatibility = getSkillsCompatibility();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'relative group cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 p-3 border rounded-md bg-gray-50 text-gray-700 w-64',
        isDragging && 'shadow-xl scale-110 z-50',
        isPending && 'ring-4 ring-orange-400'
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
          />
          <AvatarFallback className="text-sm font-semibold">
            {developer.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-bold text-sm">{developer.name}</div>
          <div className="text-xs text-gray-500">{developer.email}</div>
          <div className="flex items-center gap-1 mt-1">
            <Badge
              className={cn(
                'h-3 w-3 p-0 text-xs border border-white',
                getStatusColor(developer.status)
              )}
              title={developer.status}
            />
            <span className="text-xs capitalize">{developer.status}</span>
          </div>
        </div>
      </div>

      {/* Proyecto actual */}
      {currentProject && (
        <div className="mb-2 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
          <div className="text-xs font-medium text-blue-700">
            📋 {currentProject.name}
          </div>
          {skillsCompatibility && (
            <div className="text-xs text-green-600 mt-1">
              🎯 Match: {skillsCompatibility.percentage}% (
              {skillsCompatibility.matching}/{skillsCompatibility.total})
            </div>
          )}
        </div>
      )}

      {/* Skills con indicadores de compatibilidad */}
      <div className="text-xs mb-2">
        <span className="font-semibold">🛠️ Skills:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {developer.skills.slice(0, 6).map(skill => {
            const isRequired = currentProject?.requiredSkills.includes(skill);
            return (
              <span
                key={skill}
                className={`px-1.5 py-0.5 text-xs rounded ${
                  isRequired
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
                title={isRequired ? 'Skill requerida en el proyecto' : skill}
              >
                {isRequired && '★'} {skill}
              </span>
            );
          })}
          {developer.skills.length > 6 && (
            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
              +{developer.skills.length - 6}
            </span>
          )}
        </div>
      </div>

      {/* Información de cambios pendientes */}
      {isPending && (
        <div className="text-orange-600 font-medium text-xs mt-2 p-2 bg-orange-50 rounded border-l-2 border-orange-400">
          🔄{' '}
          {pendingFromProject && pendingToProject
            ? `${pendingFromProject} → ${pendingToProject}`
            : pendingFromProject
              ? `Saliendo de ${pendingFromProject}`
              : pendingToProject
                ? `Uniéndose a ${pendingToProject}`
                : 'Cambio pendiente'}
        </div>
      )}
    </div>
  );
}
