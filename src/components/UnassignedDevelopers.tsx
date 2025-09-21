import { useDroppable } from '@dnd-kit/core';
import { DeveloperCard } from './DeveloperCard';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

export function UnassignedDevelopers() {
  const { getUnassignedDevelopers, pendingChanges } = useProjectStore();
  const unassignedDevelopers = getUnassignedDevelopers();

  const { isOver, setNodeRef } = useDroppable({
    id: 'unassigned',
    data: {
      type: 'unassigned',
    },
  });

  return (
    <div className="h-full">
      <div
        ref={setNodeRef}
        className={cn(
          'h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm transition-all duration-200 overflow-visible',
          isOver && 'border-emerald-300 bg-emerald-50/70 shadow-md'
        )}
      >
        {unassignedDevelopers.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-6">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-sm font-medium">Todos asignados</p>
              <p className="text-xs text-gray-400 mt-1">¡Excelente trabajo!</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-gray-600">
                {unassignedDevelopers.length} disponible
                {unassignedDevelopers.length !== 1 ? 's' : ''}
              </span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3 overflow-visible">
              {unassignedDevelopers.map(developer => {
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
          </div>
        )}
      </div>
    </div>
  );
}
