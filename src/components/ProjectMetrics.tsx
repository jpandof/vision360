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

  return (
    <div className="bg-white border rounded-lg p-2">
      <div className="grid grid-cols-4 gap-1 text-xs">
        {/* Proyectos activos */}
        <div className="text-center">
          <div className="font-semibold text-green-600">{activeProjects}</div>
          <div className="text-gray-500 text-xs">Activos</div>
        </div>

        {/* Desarrolladores disponibles */}
        <div className="text-center">
          <div
            className={`font-semibold ${availableDevelopers < 3 ? 'text-red-600' : 'text-green-600'}`}
          >
            {availableDevelopers}
          </div>
          <div className="text-gray-500 text-xs">Libres</div>
        </div>

        {/* Proyectos urgentes */}
        <div className="text-center">
          <div
            className={`font-semibold ${urgentProjects > 0 ? 'text-red-600' : 'text-gray-400'}`}
          >
            {urgentProjects}
          </div>
          <div className="text-gray-500 text-xs">Urgentes</div>
        </div>

        {/* Sin equipo */}
        <div className="text-center">
          <div
            className={`font-semibold ${understaffedProjects > 0 ? 'text-orange-600' : 'text-gray-400'}`}
          >
            {understaffedProjects}
          </div>
          <div className="text-gray-500 text-xs">Sin team</div>
        </div>
      </div>

      {/* Alertas críticas condensadas */}
      {(urgentProjects > 0 ||
        understaffedProjects > 0 ||
        availableDevelopers < 3) && (
        <div className="mt-1 pt-1 border-t text-xs text-red-600 font-medium">
          {urgentProjects > 0 && '🚨'}
          {understaffedProjects > 0 && '⚠️'}
          {availableDevelopers < 3 && '🔴'}
        </div>
      )}
    </div>
  );
}
