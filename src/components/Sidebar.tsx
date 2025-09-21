import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/stores/projectStore';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('proyectos');
  const { projects, developers } = useProjectStore();

  return (
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
            <SheetTitle className="text-xl">Gestión de Proyectos</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Panel de control para desarrolladores
            </p>
          </SheetHeader>

          {/* Navegación con pestañas */}
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
                        <p>Desarrolladores: {project.developerIds.length}</p>
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
  );
}
