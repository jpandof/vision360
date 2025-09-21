import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/stores/projectStore';

export function ConfirmationModal() {
  const {
    isConfirmationOpen,
    pendingChanges,
    confirmChanges,
    cancelChanges,
    closeConfirmation,
  } = useProjectStore();

  const handleConfirm = () => {
    confirmChanges();
    closeConfirmation();
  };

  const handleCancel = () => {
    cancelChanges();
    closeConfirmation();
  };

  return (
    <Dialog open={isConfirmationOpen} onOpenChange={closeConfirmation}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Confirmar Cambios de Asignación
          </DialogTitle>
          <DialogDescription>
            Revisa los cambios que estás a punto de realizar. Estos cambios
            afectarán la asignación de desarrolladores a proyectos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {pendingChanges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay cambios pendientes</p>
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700">
                {pendingChanges.length} cambio
                {pendingChanges.length !== 1 ? 's' : ''} pendiente
                {pendingChanges.length !== 1 ? 's' : ''}:
              </div>

              {pendingChanges.map((change, index) => (
                <Card key={`${change.developerId}-${index}`} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      {/* Developer info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${change.developer.name}`}
                          />
                          <AvatarFallback>
                            {change.developer.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {change.developer.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {change.developer.email}
                          </p>
                        </div>
                      </div>

                      {/* Change arrow */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="text-right">
                            {change.fromProject ? (
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200"
                                >
                                  {change.fromProject.name}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Proyecto actual
                                </p>
                              </div>
                            ) : (
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700"
                                >
                                  Sin asignar
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Estado actual
                                </p>
                              </div>
                            )}
                          </div>

                          <svg
                            className="h-4 w-4 text-gray-400 mx-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>

                          <div className="text-left">
                            {change.toProject ? (
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  {change.toProject.name}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Nuevo proyecto
                                </p>
                              </div>
                            ) : (
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700"
                                >
                                  Sin asignar
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Nuevo estado
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills compatibility check */}
                    {change.toProject && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Compatibilidad de skills:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {change.toProject.requiredSkills.map(skill => {
                            const hasSkill =
                              change.developer.skills.includes(skill);
                            return (
                              <span
                                key={skill}
                                className={`px-2 py-1 text-xs rounded ${
                                  hasSkill
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {skill} {hasSkill ? '✓' : '✗'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={pendingChanges.length === 0}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Confirmar {pendingChanges.length} cambio
            {pendingChanges.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
