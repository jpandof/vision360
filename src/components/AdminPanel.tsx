import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from './ProjectCard';
import { UnassignedDevelopers } from './UnassignedDevelopers';
import { ConfirmationModal } from './ConfirmationModal';
import { useProjectStore, type Developer } from '@/stores/projectStore';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('proyectos');

  const {
    projects,
    developers,
    pendingChanges,
    moveDeveloper,
    openConfirmation,
    clearPendingChanges,
    getDeveloperProject,
  } = useProjectStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (event: DragStartEvent) => {
    // Opcional: lógica adicional si la necesitas
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current?.developer) return;

    const developer = active.data.current.developer as Developer;
    const currentProject = getDeveloperProject(developer.id);
    const fromProjectId = currentProject?.id || null;

    let toProjectId: string | null = null;

    if (over.data.current?.type === 'project') {
      toProjectId = over.data.current.project.id;
    } else if (over.data.current?.type === 'unassigned') {
      toProjectId = null;
    }

    // Only create a change if it's actually different
    if (fromProjectId !== toProjectId) {
      moveDeveloper(developer.id, fromProjectId, toProjectId);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Panel lateral izquierdo con hamburguesa */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-xl">
                  Gestión de Proyectos
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Panel de control para desarrolladores
                </p>
              </SheetHeader>

              {/* Navegación con pestañas minimizadas */}
              <div className="flex-1 p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="proyectos"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Proyectos
                    </TabsTrigger>
                    <TabsTrigger
                      value="desarrolladores"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4"
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
                      Desarrolladores
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="proyectos" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Gestión de Proyectos
                        </h3>
                        <Button size="sm">Nuevo Proyecto</Button>
                      </div>

                      {projects.map(project => (
                        <Card key={project.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge
                              className={
                                project.status === 'activo'
                                  ? 'bg-green-500 text-white'
                                  : project.status === 'completado'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-yellow-500 text-white'
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Desarrolladores: {project.developerIds.length}
                            </p>
                            <p>Deadline: {project.deadline}</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="desarrolladores" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Equipo de Desarrollo
                        </h3>
                        <Button size="sm">Agregar Dev</Button>
                      </div>

                      {developers.map(dev => (
                        <Card key={dev.id} className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{dev.name}</h4>
                                <Badge
                                  className={
                                    dev.status === 'activo'
                                      ? 'bg-green-500 text-white'
                                      : dev.status === 'disponible'
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-purple-500 text-white'
                                  }
                                >
                                  {dev.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {dev.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Skills: {dev.skills.slice(0, 3).join(', ')}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Contenido principal - Vista de drag & drop */}
        <div className="flex-1 p-8 ml-16">
          <div className="max-w-7xl mx-auto">
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

            {/* Grid de proyectos y desarrolladores disponibles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Desarrolladores disponibles */}
              <div className="lg:col-span-1">
                <UnassignedDevelopers />
              </div>

              {/* Proyectos */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Proyectos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {projects.filter(p => p.status === 'activo').length} activos
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
                    {developers.filter(d => d.status === 'disponible').length}{' '}
                    disponibles
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
                  <CardTitle className="text-sm font-medium">
                    Asignaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.reduce(
                      (acc, p) => acc + p.developerIds.length,
                      0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desarrolladores asignados
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal de confirmación */}
        <ConfirmationModal />
      </div>
    </DndContext>
  );
}
