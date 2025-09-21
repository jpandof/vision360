import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-1 px-2 pt-2">
        <CardTitle className="text-xs flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0zM5 20v-2a7 7 0 0114 0v2"
            />
          </svg>
          Disponibles ({unassignedDevelopers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0 px-2 pb-2">
        <div
          ref={setNodeRef}
          className={cn(
            'h-full p-1 border border-dashed border-gray-300 rounded transition-colors overflow-auto',
            isOver && 'border-green-400 bg-green-50'
          )}
        >
          {unassignedDevelopers.length === 0 ? (
            <div className="flex items-center justify-center h-12 text-muted-foreground">
              <p className="text-xs">Todos asignados</p>
            </div>
          ) : (
            <div className="space-y-1">
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
