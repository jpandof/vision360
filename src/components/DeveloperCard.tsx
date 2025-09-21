import { useDraggable } from '@dnd-kit/core';
import { useProjectStore, type Developer } from '@/stores/projectStore';
import { SimpleDeveloperView } from './developer/SimpleDeveloperView';
import { DetailedDeveloperView } from './developer/DetailedDeveloperView';

interface DeveloperCardProps {
  developer: Developer;
  isPending?: boolean;
  pendingFromProject?: string;
  pendingToProject?: string;
}

export function DeveloperCard({
  developer,
  isPending = false,
  pendingFromProject,
  pendingToProject,
}: DeveloperCardProps) {
  const { showSimpleView } = useProjectStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: developer.id,
      data: {
        type: 'developer',
        developer,
      },
    });

  // Mejorar el estilo del transform para evitar retrasos
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 9999,
      }
    : undefined;

  const commonProps = {
    developer,
    isPending,
    pendingFromProject,
    pendingToProject,
    isDragging,
    setNodeRef,
    style,
    listeners,
    attributes,
  };

  return showSimpleView ? (
    <SimpleDeveloperView {...commonProps} />
  ) : (
    <DetailedDeveloperView {...commonProps} />
  );
}
