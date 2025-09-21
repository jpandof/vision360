import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/stores/projectStore';

export function ProjectHeader() {
  const { pendingChanges, openConfirmation, clearPendingChanges } =
    useProjectStore();

  // Solo mostrar los botones si hay cambios pendientes
  if (pendingChanges.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={clearPendingChanges}
        size="sm"
        className="relative"
      >
        Limpiar cambios
      </Button>
      <Button
        onClick={openConfirmation}
        size="sm"
        className="relative bg-orange-500 hover:bg-orange-600"
      >
        Revisar cambios
        <Badge className="ml-2 bg-white text-orange-500">
          {pendingChanges.length}
        </Badge>
      </Button>
    </div>
  );
}
