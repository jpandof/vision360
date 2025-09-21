import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/stores/projectStore';

export function ProjectHeader() {
  const { pendingChanges, openConfirmation, clearPendingChanges } =
    useProjectStore();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Asignación de Desarrolladores
        </h1>
        <p className="text-gray-600">
          Arrastra y suelta desarrolladores entre proyectos
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        {pendingChanges.length > 0 && (
          <>
            <Button
              variant="outline"
              onClick={clearPendingChanges}
              className="relative"
            >
              Limpiar cambios
            </Button>
            <Button
              onClick={openConfirmation}
              className="relative bg-orange-500 hover:bg-orange-600"
            >
              Revisar cambios
              <Badge className="ml-2 bg-white text-orange-500">
                {pendingChanges.length}
              </Badge>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
