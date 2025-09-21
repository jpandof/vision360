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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('proyectos');

  const projects = [
    {
      id: 1,
      name: 'Vision360',
      status: 'activo',
      developers: 3,
      deadline: '2024-01-15',
    },
    {
      id: 2,
      name: 'E-commerce App',
      status: 'completado',
      developers: 2,
      deadline: '2023-12-20',
    },
    {
      id: 3,
      name: 'CRM System',
      status: 'en-pausa',
      developers: 4,
      deadline: '2024-03-10',
    },
  ];

  const developers = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@dev.com',
      project: 'Vision360',
      status: 'activo',
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@dev.com',
      project: 'E-commerce App',
      status: 'disponible',
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@dev.com',
      project: 'CRM System',
      status: 'vacaciones',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-500';
      case 'completado':
        return 'bg-blue-500';
      case 'en-pausa':
        return 'bg-yellow-500';
      case 'disponible':
        return 'bg-gray-500';
      case 'vacaciones':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
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
              <SheetTitle className="text-xl">Gestión de Proyectos</SheetTitle>
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
                        Proyectos Activos
                      </h3>
                      <Button size="sm">Nuevo Proyecto</Button>
                    </div>

                    {projects.map(project => (
                      <Card key={project.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Desarrolladores: {project.developers}</p>
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
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`}
                            />
                            <AvatarFallback>
                              {dev.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{dev.name}</h4>
                              <Badge className={getStatusColor(dev.status)}>
                                {dev.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {dev.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Proyecto: {dev.project}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            Asignar
                          </Button>
                          <Button variant="outline" size="sm">
                            Contactar
                          </Button>
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

      {/* Contenido principal */}
      <div className="flex-1 p-8 ml-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard de Proyectos
            </h1>
            <p className="text-gray-600">
              Gestiona tus proyectos y equipo de desarrollo
            </p>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Proyectos Activos
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 en desarrollo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Desarrolladores
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">5 disponibles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Entregas esta semana
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">1 retrasada</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Productividad
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  +5% vs mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Proyectos recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimos movimientos en tus proyectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Vision360 - Sprint completado</p>
                    <p className="text-sm text-muted-foreground">
                      Juan Pérez finalizó el módulo de autenticación
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Hace 2h</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">
                      E-commerce App - Proyecto finalizado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      María García liberó la versión final
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Ayer</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">CRM System - En pausa</p>
                    <p className="text-sm text-muted-foreground">
                      Carlos López pausó el desarrollo por revisión de
                      requisitos
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Hace 3 días
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
