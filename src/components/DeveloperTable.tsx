import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useMemo } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import type { Developer } from '@/stores/projectStore';
import { ArrowUpDown } from "lucide-react"

// Tipo extendido para incluir información de proyecto
type DeveloperWithProject = Developer & {
  currentProject?: any;
  isSquadLead: boolean;
  projectCount: number;
  allProjects: any[];
};

export function DeveloperTable() {
  const { developers, projects } = useProjectStore();
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Preparar datos con información de proyecto
  const data = useMemo<DeveloperWithProject[]>(() => {
    return developers.map(developer => {
      const currentProject = projects.find(project =>
        project.developerIds.includes(developer.id)
      );
      const isSquadLead = currentProject?.squadLeadId === developer.id;
      const allProjects = projects.filter(project =>
        project.developerIds.includes(developer.id)
      );

      return {
        ...developer,
        currentProject,
        isSquadLead,
        projectCount: allProjects.length,
        allProjects,
      };
    });
  }, [developers, projects]);

  // Funciones helper para colores y iconos
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disponible':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vacaciones':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'junior':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'developer':
        return '💻';
      case 'tech-lead':
        return '🎯';
      default:
        return '💻';
    }
  };

  // Definir columnas
  const columns: ColumnDef<DeveloperWithProject>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Desarrollador
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const developer = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className={cn(
                'h-9 w-9',
                developer.performance === 'excellent' && 'border-2 border-green-400',
                developer.performance === 'needs-improvement' && 'border-2 border-yellow-400'
              )}>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
                />
                <AvatarFallback className="text-xs">
                  {developer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Indicadores de performance */}
              {developer.performance === 'excellent' && (
                <div className="absolute -top-0.5 -right-0.5 bg-green-500 text-white rounded-full h-3 w-3 flex items-center justify-center text-xs">
                  ⭐
                </div>
              )}
              {developer.performance === 'needs-improvement' && (
                <div className="absolute -top-0.5 -right-0.5 bg-yellow-500 text-white rounded-full h-3 w-3 flex items-center justify-center text-xs">
                  ⚠️
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900">
                {developer.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {developer.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Rol & Funciones
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const developer = row.original;
        return (
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              {getRoleIcon(developer.role)} {developer.role === 'tech-lead' ? 'Tech Lead' : 'Developer'}
            </Badge>
            {developer.functions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {developer.functions.map((func) => (
                  <Badge key={func} className="bg-purple-100 text-purple-700 text-xs">
                    {func === 'squad-lead' ? '👑 SL' : '⭐ SE'}
                  </Badge>
                ))}
              </div>
            )}
            {developer.isSquadLead && (
              <Badge className="bg-purple-600 text-white text-xs">
                👑 Squad Lead
              </Badge>
            )}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;
        // Prioridad: tech-lead > functions.length > role
        const aScore = (a.role === 'tech-lead' ? 100 : 0) + (a.functions.length * 10) + (a.isSquadLead ? 5 : 0);
        const bScore = (b.role === 'tech-lead' ? 100 : 0) + (b.functions.length * 10) + (b.isSquadLead ? 5 : 0);
        return aScore - bScore;
      },
    },
    {
      accessorKey: "seniority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Seniority
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge className={cn('text-xs capitalize', getSeniorityColor(row.getValue("seniority")))}>
          {row.getValue("seniority")}
        </Badge>
      ),
      sortingFn: (rowA, rowB) => {
        const seniorityOrder = { junior: 1, mid: 2, senior: 3, staff: 4 };
        const a = seniorityOrder[rowA.getValue("seniority") as keyof typeof seniorityOrder];
        const b = seniorityOrder[rowB.getValue("seniority") as keyof typeof seniorityOrder];
        return a - b;
      },
    },
    {
      accessorKey: "yearsOfExperience",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Exp.
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.getValue("yearsOfExperience")}y
        </div>
      ),
    },
    {
      accessorKey: "performance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Performance
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const performance = row.getValue("performance") as string;
        return (
          <Badge className={cn('text-xs', getPerformanceColor(performance))}>
            {performance === 'needs-improvement' ? '⚠️ Mejora' :
             performance === 'excellent' ? '⭐ Excelente' :
             performance === 'good' ? '👍 Bueno' :
             '📊 Promedio'}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const performanceOrder = { 'needs-improvement': 1, average: 2, good: 3, excellent: 4 };
        const a = performanceOrder[rowA.getValue("performance") as keyof typeof performanceOrder];
        const b = performanceOrder[rowB.getValue("performance") as keyof typeof performanceOrder];
        return a - b;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Estado
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={cn('text-xs capitalize', getStatusColor(status))}>
            {status === 'activo' ? '🟢 Activo' :
             status === 'disponible' ? '🔵 Disponible' :
             '🟣 Vacaciones'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "currentProject",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-gray-100"
          >
            Proyecto
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const developer = row.original;
        return developer.currentProject ? (
          <div>
            <div className="font-medium text-gray-900 truncate max-w-40">
              {developer.currentProject.name}
            </div>
            {developer.projectCount > 1 && (
              <div className="text-xs text-blue-600">
                +{developer.projectCount - 1} más
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Sin asignar</span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.currentProject?.name || '';
        const b = rowB.original.currentProject?.name || '';
        return a.localeCompare(b);
      },
    },
    {
      accessorKey: "skills",
      header: "Skills",
      cell: ({ row }) => {
        const developer = row.original;
        return (
          <div className="flex flex-wrap gap-1 max-w-56">
            {developer.skills.slice(0, 3).map((skill) => {
              const isRequired = developer.currentProject?.requiredSkills.includes(skill);
              return (
                <Badge
                  key={skill}
                  variant="outline"
                  className={cn(
                    'text-xs',
                    isRequired && 'bg-green-100 text-green-700 border-green-300'
                  )}
                >
                  {isRequired && '★'}{skill.length > 8 ? skill.slice(0, 8) + '...' : skill}
                </Badge>
              );
            })}
            {developer.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{developer.skills.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  // Configurar tabla
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) => {
      const developer = row.original;
      const searchValue = value.toLowerCase();

      return (
        developer.name.toLowerCase().includes(searchValue) ||
        developer.email.toLowerCase().includes(searchValue) ||
        developer.skills.some(skill => skill.toLowerCase().includes(searchValue)) ||
        (developer.currentProject?.name.toLowerCase().includes(searchValue) || false) ||
        developer.role.toLowerCase().includes(searchValue) ||
        developer.status.toLowerCase().includes(searchValue) ||
        developer.performance.toLowerCase().includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 100, // Mostrar muchos items por página
      },
    },
  });

  return (
    <div className="h-full flex flex-col">
      {/* Filtros y controles */}
      <div className="flex items-center justify-between py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar en toda la tabla..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />

          {/* Filtros rápidos */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const needsImprovementColumn = table.getColumn("performance");
                needsImprovementColumn?.setFilterValue("needs-improvement");
              }}
              className="text-xs"
            >
              ⚠️ Problemas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const availableColumn = table.getColumn("status");
                availableColumn?.setFilterValue("disponible");
              }}
              className="text-xs"
            >
              🔵 Disponibles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
                setGlobalFilter("");
              }}
              className="text-xs"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {table.getFilteredRowModel().rows.length} desarrolladores
        </div>
      </div>

      {/* Tabla que ocupa todo el espacio */}
      <div className="rounded-md border flex-1 overflow-auto bg-white">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-50">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron desarrolladores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info de ordenamiento múltiple */}
      {sorting.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 py-2 flex-shrink-0">
          <span>Ordenado por:</span>
          {sorting.map((sort, index) => (
            <Badge key={sort.id} variant="outline" className="text-xs">
              {sort.id} {sort.desc ? '↓' : '↑'}
              {index < sorting.length - 1 && ', '}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSorting([])}
            className="text-xs h-auto p-1 ml-2"
          >
            Limpiar ordenamiento
          </Button>
        </div>
      )}
    </div>
  );
}
