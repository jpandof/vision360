import { useProjectStore } from '@/stores/projectStore';

export function ProjectMetrics() {
  const { projects, developers } = useProjectStore();

  const activeProjects = projects.filter(p => p.status === 'activo').length;
  const totalDevelopers = developers.length;
  const assignedDevelopers = developers.filter(dev =>
    projects.some(project => project.developerIds.includes(dev.id))
  ).length;
  const availableDevelopers = totalDevelopers - assignedDevelopers;

  // Calcular proyectos urgentes
  const urgentProjects = projects.filter(project => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0 && project.status === 'activo';
  }).length;

  // Nuevas métricas de desarrolladores
  const excellentDevelopers = developers.filter(
    dev => dev.performance === 'excellent'
  ).length;
  const needsImprovementDevelopers = developers.filter(
    dev => dev.performance === 'needs-improvement'
  ).length;
  const staffLevel = developers.filter(
    dev =>
      dev.seniority === 'staff' ||
      dev.role === 'staff-engineer' ||
      dev.role === 'tech-lead'
  ).length;

  const metrics = [
    {
      label: 'Activos',
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
      label: 'Top Performers',
      value: excellentDevelopers,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '🌟',
    },
    {
      label: 'Staff/Leads',
      value: staffLevel,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '👑',
    },
    {
      label: 'Urgentes',
      value: urgentProjects,
      color: urgentProjects > 0 ? 'text-amber-600' : 'text-gray-400',
      bgColor: urgentProjects > 0 ? 'bg-amber-50' : 'bg-gray-50',
      icon: '⚡',
    },
    {
      label: 'Tarjeta Amarilla',
      value: needsImprovementDevelopers,
      color:
        needsImprovementDevelopers > 0 ? 'text-yellow-600' : 'text-gray-400',
      bgColor: needsImprovementDevelopers > 0 ? 'bg-yellow-50' : 'bg-gray-50',
      icon: '⚠️',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} rounded-xl p-2 border border-white/50 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{metric.icon}</span>
            <span className={`text-sm font-bold ${metric.color}`}>
              {metric.value}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
