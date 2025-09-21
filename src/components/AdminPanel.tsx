import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { DragDropArea } from './DragDropArea';
import { ConfirmationModal } from './ConfirmationModal';
import { useProjectStore, type Developer } from '@/stores/projectStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <SidebarProvider>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="h-full">
            <DragDropArea />
            <ConfirmationModal />
          </div>
        </DndContext>
      </SidebarProvider>
    </TooltipProvider>
  );
}
