import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectStore } from '@/stores/projectStore';

export function ProjectStatistics() {
  const { projects, developers, pendingChanges } = useProjectStore();

  const activeProjects = projects.filter(p => p.status === 'activo').length;
  const availableDevelopers = developers.filter(
    d => d.status === 'disponible'
  ).length;
  const totalAssignments = projects.reduce(
    (acc, p) => acc + p.developerIds.length,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground">
            {activeProjects} activos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Desarrolladores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{developers.length}</div>
          <p className="text-xs text-muted-foreground">
            {availableDevelopers} disponibles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cambios Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {pendingChanges.length}
          </div>
          <p className="text-xs text-muted-foreground">Sin confirmar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Asignaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}</div>
          <p className="text-xs text-muted-foreground">
            Desarrolladores asignados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
