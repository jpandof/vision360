import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './Sidebar';
import { ProjectHeader } from './ProjectHeader';
import { DragDropArea } from './DragDropArea';
import { ProjectStatistics } from './ProjectStatistics';
import { ConfirmationModal } from './ConfirmationModal';
import { useProjectStore, type Developer } from '@/stores/projectStore';

export default function AdminPanel() {
  const { moveDeveloper, getDeveloperProject } = useProjectStore();

  const handleDragStart = () => {
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

    if (fromProjectId !== toProjectId) {
      moveDeveloper(developer.id, fromProjectId, toProjectId);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />

        <div className="flex-1 p-8 ml-16">
          <div className="max-w-7xl mx-auto">
            <ProjectHeader />
            <DragDropArea />
            <div className="mt-8">
              <ProjectStatistics />
            </div>
          </div>
        </div>

        <ConfirmationModal />
      </div>
    </DndContext>
  );
}
