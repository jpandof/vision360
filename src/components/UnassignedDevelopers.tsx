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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          Desarrolladores Disponibles
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {unassignedDevelopers.length} desarrolladores sin asignar
        </p>
      </CardHeader>
      <CardContent>
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg transition-colors',
            isOver && 'border-green-400 bg-green-50'
          )}
        >
          {unassignedDevelopers.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <svg
                  className="h-12 w-12 mx-auto mb-2 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm">
                  Todos los desarrolladores están asignados
                </p>
                <p className="text-xs">
                  Arrastra desarrolladores aquí para desasignarlos
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
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
