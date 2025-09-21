import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type Developer } from '@/stores/projectStore';
import { cn } from '@/lib/utils';
import { type DraggableAttributes } from '@dnd-kit/core';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useProjectStore } from '@/stores/projectStore';

interface SimpleDeveloperViewProps {
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

export function SimpleDeveloperView({
  developer,
  isPending = false,
  pendingFromProject,
  pendingToProject,
  isDragging = false,
  setNodeRef,
  style,
  listeners,
  attributes,
}: SimpleDeveloperViewProps) {
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

  // Calcular compatibilidad con skills
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
        'relative group cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105',
        isDragging && 'shadow-xl scale-110 z-50',
        isPending && 'ring-4 ring-orange-400'
      )}
    >
      {/* Avatar principal */}
      <div className="relative">
        <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
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
        {/* Badge de status */}
        <Badge
          className={cn(
            'absolute -top-1 -right-1 h-4 w-4 p-0 text-xs border-2 border-white',
            getStatusColor(developer.status)
          )}
          title={developer.status}
        />
      </div>
      {/* Tooltip con información completa y útil */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 min-w-[250px]">
        <div className="font-semibold text-sm">{developer.name}</div>
        <div className="text-gray-300">{developer.email}</div>
        <div className="text-gray-300 mb-2">Estado: {developer.status}</div>

        {/* Proyecto actual */}
        {currentProject && (
          <div className="mb-2 pb-2 border-b border-gray-600">
            <div className="text-blue-300 font-medium">
              📋 {currentProject.name}
            </div>
            {skillsCompatibility && (
              <div className="text-green-300">
                🎯 Compatibilidad: {skillsCompatibility.matching}/
                {skillsCompatibility.total} skills (
                {skillsCompatibility.percentage}%)
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        <div className="mb-2">
          <div className="text-yellow-300 font-medium">
            🛠️ Skills principales:
          </div>
          <div className="text-gray-300">
            {developer.skills.slice(0, 4).join(', ')}
            {developer.skills.length > 4 &&
              ` +${developer.skills.length - 4} más`}
          </div>
        </div>

        {/* Información de cambios pendientes */}
        {isPending && (
          <div className="text-orange-300 font-medium mt-2 pt-2 border-t border-gray-600">
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

        {/* Flecha del tooltip */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
      {/* Nombre debajo del avatar */}
      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-gray-700 leading-tight max-w-[80px]">
          {developer.name}
        </div>
      </div>
    </div>
  );
}
