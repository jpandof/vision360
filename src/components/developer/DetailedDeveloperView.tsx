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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'developer':
        return '💻';
      case 'tech-lead':
        return '🎯';
      default:
        return '💻';
    }
  };

  const getFunctionIcon = (functionType: string) => {
    switch (functionType) {
      case 'squad-lead':
        return '👑';
      case 'staff-engineer':
        return '⭐';
      default:
        return '';
    }
  };

  const getFunctionLabel = (functionType: string) => {
    switch (functionType) {
      case 'squad-lead':
        return 'Squad Lead';
      case 'staff-engineer':
        return 'Staff Engineer';
      default:
        return '';
    }
  };

  // Determinar el estilo del borde basado en performance
  const getPerformanceBorderStyle = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'border-2 border-green-400 bg-green-50';
      case 'needs-improvement':
        return 'border-2 border-yellow-400 bg-yellow-50';
      default:
        return 'border border-gray-200 bg-gray-50';
    }
  };

  // Determinar si es líder
  const isLeader =
    developer.role === 'tech-lead' || developer.functions.length > 0;

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
        'relative group cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 p-3 rounded-md text-gray-700 w-64',
        isDragging && 'shadow-xl scale-110 z-50',
        isPending && 'ring-4 ring-orange-400',
        getPerformanceBorderStyle(developer.performance)
      )}
    >
      {/* Header con avatar y indicadores */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
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

          {/* Badge de performance o liderazgo */}
          {developer.performance === 'excellent' && (
            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              ⭐
            </div>
          )}

          {developer.performance === 'needs-improvement' && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              ⚠️
            </div>
          )}

          {isLeader &&
            developer.performance !== 'excellent' &&
            developer.performance !== 'needs-improvement' && (
              <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {developer.role === 'tech-lead'
                  ? getRoleIcon(developer.role)
                  : developer.functions.includes('squad-lead')
                    ? getFunctionIcon('squad-lead')
                    : getFunctionIcon('staff-engineer')}
              </div>
            )}
        </div>

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

      {/* Información profesional */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <div className="font-medium text-gray-600">
            {getRoleIcon(developer.role)} {developer.role}
          </div>
          <div className="text-gray-500">
            {developer.seniority} • {developer.yearsOfExperience}y
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-600">Performance</div>
          <div
            className={cn(
              'capitalize font-medium',
              developer.performance === 'excellent' && 'text-green-600',
              developer.performance === 'needs-improvement' &&
                'text-yellow-600',
              developer.performance === 'good' && 'text-blue-600',
              developer.performance === 'average' && 'text-gray-600'
            )}
          >
            {developer.performance}
          </div>
        </div>
      </div>

      {/* Funciones especiales */}
      {developer.functions.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-purple-600 mb-1">
            🎖️ Funciones:
          </div>
          <div className="flex flex-wrap gap-1">
            {developer.functions.map(func => (
              <Badge
                key={func}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs py-0 px-2"
              >
                {getFunctionIcon(func)} {getFunctionLabel(func)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Proyecto actual con información de Squad Lead */}
      {currentProject && (
        <div className="mb-3 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
          <div className="text-xs font-medium text-blue-700">
            📋 {currentProject.name}
          </div>
          {currentProject.squadLeadId === developer.id && (
            <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              👑{' '}
              <span className="font-semibold">Squad Lead de este proyecto</span>
            </div>
          )}
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
