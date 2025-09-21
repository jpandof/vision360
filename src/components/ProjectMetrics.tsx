import { useProjectStore } from '@/stores/projectStore';

export function ProjectMetrics() {
  const { projects, developers } = useProjectStore();

  const activeProjects = projects.filter(p => p.status === 'activo').length;
  const totalDevelopers = developers.length;
  const assignedDevelopers = developers.filter(dev =>
    projects.some(project => project.developerIds.includes(dev.id))
  ).length;
  const availableDevelopers = totalDevelopers - assignedDevelopers;

  // Calcular proyectos con deadlines próximos
  const urgentProjects = projects.filter(project => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0 && project.status === 'activo';
  }).length;

  const understaffedProjects = projects.filter(
    project => project.developerIds.length === 0 && project.status === 'activo'
  ).length;

  const metrics = [
    {
      label: 'Proyectos Activos',
      value: activeProjects,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      icon: '📊',
    },
    {
      label: 'Disponibles',
      value: availableDevelopers,
      color: availableDevelopers < 3 ? 'text-red-500' : 'text-blue-600',
      bgColor: availableDevelopers < 3 ? 'bg-red-50' : 'bg-blue-50',
      icon: '👥',
    },
    {
      label: 'Urgentes',
      value: urgentProjects,
      color: urgentProjects > 0 ? 'text-amber-600' : 'text-gray-400',
      bgColor: urgentProjects > 0 ? 'bg-amber-50' : 'bg-gray-50',
      icon: '⚡',
    },
    {
      label: 'Sin Equipo',
      value: understaffedProjects,
      color: understaffedProjects > 0 ? 'text-red-500' : 'text-gray-400',
      bgColor: understaffedProjects > 0 ? 'bg-red-50' : 'bg-gray-50',
      icon: '⚠️',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} rounded-xl p-3 border border-white/50 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">{metric.icon}</span>
            <span className={`text-lg font-bold ${metric.color}`}>
              {metric.value}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
