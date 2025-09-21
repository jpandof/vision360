import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Developer } from '@/stores/projectStore';
import { cn } from '@/lib/utils';
import { type DraggableAttributes } from '@dnd-kit/core';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useProjectStore } from '@/stores/projectStore';
import React from 'react';

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
        return 'SQUAD LEAD';
      case 'staff-engineer':
        return 'STAFF ENGINEER';
      default:
        return '';
    }
  };

  // Determinar el estilo visual principal basado en performance
  const getPerformanceStyle = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return {
          avatar: 'border-2 border-green-400',
        };
      case 'needs-improvement':
        return {
          avatar: 'border-2 border-yellow-400',
        };
      default:
        return {
          avatar: 'border border-gray-200',
        };
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
  const performanceStyle = getPerformanceStyle(developer.performance);

  // Determinar si es líder basado en rol o funciones
  const isLeader =
    developer.role === 'tech-lead' || developer.functions.length > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className={cn(
            'relative cursor-grab active:cursor-grabbing transition-opacity duration-200 flex flex-col items-center p-1',
            isDragging && 'opacity-50',
            isPending && 'ring-2 ring-orange-400'
          )}
        >
          {/* Avatar simplificado con indicadores claros */}
          <div className="relative">
            <Avatar
              className={cn('h-10 w-10 shadow-md', performanceStyle.avatar)}
            >
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
              />
              <AvatarFallback className="text-xs font-semibold">
                {developer.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            {/* Solo UN indicador principal: Performance o Role */}
            {developer.performance === 'excellent' && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold">
                ⭐
              </div>
            )}

            {developer.performance === 'needs-improvement' && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold">
                ⚠️
              </div>
            )}

            {/* Badge púrpura para líderes (Tech Lead o funciones especiales) cuando no hay performance destacada */}
            {isLeader &&
              developer.performance !== 'excellent' &&
              developer.performance !== 'needs-improvement' && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {developer.role === 'tech-lead'
                    ? getRoleIcon(developer.role)
                    : developer.functions.includes('squad-lead')
                      ? getFunctionIcon('squad-lead')
                      : getFunctionIcon('staff-engineer')}
                </div>
              )}

            {/* Indicador de status discreto abajo */}
            <div
              className={cn(
                'absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-1.5 w-6 rounded-full',
                getStatusColor(developer.status)
              )}
              title={developer.status}
            />
          </div>

          {/* Nombre compacto */}
          <div className="mt-1.5 text-center w-14">
            <div className="text-xs font-medium text-gray-700 leading-tight truncate">
              {developer.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </TooltipTrigger>

      <TooltipContent
        side="top"
        className="max-w-sm bg-gray-900 text-white border-gray-700 shadow-2xl"
        sideOffset={8}
      >
        <div className="space-y-3">
          {/* Header con performance destacada */}
          <div className="flex items-center justify-between">
            <div className="font-semibold text-base">{developer.name}</div>
            <div className="flex items-center gap-2">
              {developer.performance === 'excellent' && (
                <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-full">
                  <span className="text-xs">🌟</span>
                  <span className="text-xs font-bold">TOP PERFORMER</span>
                </div>
              )}
              {developer.performance === 'needs-improvement' && (
                <div className="flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-full">
                  <span className="text-xs">⚠️</span>
                  <span className="text-xs font-bold">NECESITA MEJORA</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-gray-300 text-sm">{developer.email}</div>

          {/* Información profesional simplificada */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-700 pt-3">
            <div>
              <div className="text-blue-400 font-medium text-sm">
                💼 {getRoleIcon(developer.role)} {developer.role}
              </div>
              <div className="text-gray-300 text-xs">
                {developer.seniority} • {developer.yearsOfExperience} años
              </div>
            </div>
            <div>
              <div className="text-yellow-400 font-medium text-sm">
                📈 Performance
              </div>
              <div className="text-white text-xs capitalize">
                {developer.performance}
              </div>
            </div>
          </div>

          {/* Funciones especiales */}
          {developer.functions.length > 0 && (
            <div className="border-t border-gray-700 pt-3">
              <div className="text-purple-400 font-medium text-sm mb-2">
                🎖️ Funciones:
              </div>
              <div className="flex flex-wrap gap-1">
                {developer.functions.map(func => (
                  <div
                    key={func}
                    className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded-full"
                  >
                    <span className="text-xs">{getFunctionIcon(func)}</span>
                    <span className="text-xs font-bold">
                      {getFunctionLabel(func)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proyecto actual con información de Squad Lead */}
          {currentProject && (
            <div className="border-t border-gray-700 pt-3">
              <div className="text-green-400 font-medium text-sm">
                📋 {currentProject.name}
              </div>
              {currentProject.squadLeadId === developer.id && (
                <div className="text-purple-300 text-xs mt-1 flex items-center gap-1">
                  👑{' '}
                  <span className="font-semibold">
                    Squad Lead de este proyecto
                  </span>
                </div>
              )}
              {skillsCompatibility && (
                <div className="text-emerald-300 text-xs mt-1">
                  🎯 Compatibilidad: {skillsCompatibility.percentage}% (
                  {skillsCompatibility.matching}/{skillsCompatibility.total})
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          <div className="border-t border-gray-700 pt-3">
            <div className="text-orange-400 font-medium text-sm">
              🛠️ Skills:
            </div>
            <div className="text-gray-300 text-xs mt-1">
              {developer.skills.slice(0, 5).join(', ')}
              {developer.skills.length > 5 &&
                ` +${developer.skills.length - 5} más`}
            </div>
          </div>

          {/* Información de cambios pendientes */}
          {isPending && (
            <div className="bg-orange-600 px-3 py-2 rounded-lg text-white font-medium text-xs">
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
      </TooltipContent>
    </Tooltip>
  );
}
