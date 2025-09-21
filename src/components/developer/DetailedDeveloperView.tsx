import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type Developer } from '@/stores/projectStore';
import { cn } from '@/lib/utils';
import { type DraggableAttributes } from '@dnd-kit/core';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'relative group cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 p-4 border rounded-md bg-gray-50 text-gray-700 w-64',
        isDragging && 'shadow-xl scale-110 z-50',
        isPending && 'ring-4 ring-orange-400'
      )}
    >
      <div className="flex items-center gap-4 mb-2">
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
        <div>
          <div className="font-bold text-base">{developer.name}</div>
          <div className="text-xs text-gray-500">{developer.email}</div>
        </div>
        <Badge
          className={cn(
            'h-4 w-4 p-0 text-xs border-2 border-white',
            getStatusColor(developer.status)
          )}
          title={developer.status}
        />
      </div>
      <div className="text-xs mb-1">
        <span className="font-semibold">Skills:</span>{' '}
        {developer.skills.join(', ')}
      </div>
      {isPending && (
        <div className="text-orange-500 font-medium mt-1">
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
