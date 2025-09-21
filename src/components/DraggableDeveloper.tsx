import { useDraggable } from '@dnd-kit/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Developer } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

interface DraggableDeveloperProps {
  developer: Developer;
  isPending?: boolean;
  pendingFromProject?: string;
  pendingToProject?: string;
}

export function DraggableDeveloper({
  developer,
  isPending = false,
  pendingFromProject,
  pendingToProject,
}: DraggableDeveloperProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: developer.id,
      data: {
        type: 'developer',
        developer,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'disponible':
        return 'bg-gray-100 text-gray-800';
      case 'vacaciones':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg scale-105',
        isPending && 'ring-2 ring-orange-400 bg-orange-50'
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
          />
          <AvatarFallback className="text-xs">
            {developer.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm truncate">{developer.name}</h4>
            <Badge className={cn('text-xs', getStatusColor(developer.status))}>
              {developer.status}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {developer.email}
          </p>

          <div className="flex flex-wrap gap-1 mt-1">
            {developer.skills.slice(0, 2).map(skill => (
              <span
                key={skill}
                className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {developer.skills.length > 2 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{developer.skills.length - 2}
              </span>
            )}
          </div>

          {isPending && (
            <div className="mt-2 p-1.5 bg-orange-100 rounded text-xs">
              <span className="text-orange-800 font-medium">
                {pendingFromProject && pendingToProject
                  ? `${pendingFromProject} → ${pendingToProject}`
                  : pendingFromProject
                    ? `Saliendo de ${pendingFromProject}`
                    : pendingToProject
                      ? `Uniéndose a ${pendingToProject}`
                      : 'Cambio pendiente'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
