import { create } from 'zustand';

export interface Developer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  status: 'activo' | 'disponible' | 'vacaciones';
}

export interface Project {
  id: string;
  name: string;
  status: 'activo' | 'completado' | 'en-pausa';
  deadline: string;
  description: string;
  requiredSkills: string[];
  developerIds: string[];
}

export interface PendingChange {
  developerId: string;
  fromProjectId: string | null;
  toProjectId: string | null;
  developer: Developer;
  fromProject?: Project;
  toProject?: Project;
}

interface ProjectStore {
  // State
  projects: Project[];
  developers: Developer[];
  pendingChanges: PendingChange[];
  isConfirmationOpen: boolean;
  showSimpleView: boolean;

  // Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addDeveloper: (developer: Omit<Developer, 'id'>) => void;
  updateDeveloper: (id: string, updates: Partial<Developer>) => void;
  deleteDeveloper: (id: string) => void;

  // Drag & Drop actions
  moveDeveloper: (
    developerId: string,
    fromProjectId: string | null,
    toProjectId: string | null
  ) => void;
  clearPendingChanges: () => void;
  confirmChanges: () => void;
  cancelChanges: () => void;
  openConfirmation: () => void;
  closeConfirmation: () => void;

  // View actions
  setShowSimpleView: (value: boolean) => void;
  getShowSimpleView: () => boolean;

  // Helpers
  getProjectDevelopers: (projectId: string) => Developer[];
  getUnassignedDevelopers: () => Developer[];
  getDeveloperProject: (developerId: string) => Project | null;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [
    {
      id: '1',
      name: 'Vision360',
      status: 'activo',
      deadline: '2024-03-15',
      description: 'Plataforma de gestión de proyectos',
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      developerIds: ['1', '2'],
    },
    {
      id: '2',
      name: 'E-commerce App',
      status: 'activo',
      deadline: '2024-02-20',
      description: 'Aplicación de comercio electrónico',
      requiredSkills: ['Vue.js', 'Python', 'PostgreSQL'],
      developerIds: ['3'],
    },
    {
      id: '3',
      name: 'CRM System',
      status: 'en-pausa',
      deadline: '2024-04-10',
      description: 'Sistema de gestión de clientes',
      requiredSkills: ['Angular', 'Java', 'MySQL'],
      developerIds: [],
    },
  ],

  developers: [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@dev.com',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      status: 'activo',
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@dev.com',
      skills: ['React', 'Python', 'Django', 'PostgreSQL'],
      status: 'activo',
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@dev.com',
      skills: ['Vue.js', 'Python', 'FastAPI', 'MongoDB'],
      status: 'activo',
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana@dev.com',
      skills: ['Angular', 'Java', 'Spring', 'MySQL'],
      status: 'disponible',
    },
    {
      id: '5',
      name: 'Luis Torres',
      email: 'luis@dev.com',
      skills: ['React Native', 'Flutter', 'Firebase'],
      status: 'disponible',
    },
  ],

  pendingChanges: [],
  isConfirmationOpen: false,
  showSimpleView: true,

  // Actions
  addProject: projectData => {
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      developerIds: [],
    };
    set(state => ({
      projects: [...state.projects, newProject],
    }));
  },

  updateProject: (id, updates) => {
    set(state => ({
      projects: state.projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      ),
    }));
  },

  deleteProject: id => {
    set(state => ({
      projects: state.projects.filter(project => project.id !== id),
    }));
  },

  addDeveloper: developerData => {
    const newDeveloper = {
      ...developerData,
      id: Date.now().toString(),
    };
    set(state => ({
      developers: [...state.developers, newDeveloper],
    }));
  },

  updateDeveloper: (id, updates) => {
    set(state => ({
      developers: state.developers.map(developer =>
        developer.id === id ? { ...developer, ...updates } : developer
      ),
    }));
  },

  deleteDeveloper: id => {
    set(state => ({
      developers: state.developers.filter(developer => developer.id !== id),
      projects: state.projects.map(project => ({
        ...project,
        developerIds: project.developerIds.filter(devId => devId !== id),
      })),
    }));
  },

  // Drag & Drop actions
  moveDeveloper: (developerId, fromProjectId, toProjectId) => {
    const { developers, projects } = get();
    const developer = developers.find(dev => dev.id === developerId);
    if (!developer) return;

    const fromProject = fromProjectId
      ? projects.find(p => p.id === fromProjectId)
      : null;
    const toProject = toProjectId
      ? projects.find(p => p.id === toProjectId)
      : null;

    const pendingChange: PendingChange = {
      developerId,
      fromProjectId,
      toProjectId,
      developer,
      fromProject: fromProject || undefined,
      toProject: toProject || undefined,
    };

    set(state => ({
      pendingChanges: [
        ...state.pendingChanges.filter(
          change => change.developerId !== developerId
        ),
        pendingChange,
      ],
    }));
  },

  clearPendingChanges: () => {
    set({ pendingChanges: [] });
  },

  confirmChanges: () => {
    const { pendingChanges } = get();

    set(state => {
      const updatedProjects = [...state.projects];

      pendingChanges.forEach(change => {
        // Remove from old project
        if (change.fromProjectId) {
          const fromProject = updatedProjects.find(
            p => p.id === change.fromProjectId
          );
          if (fromProject) {
            fromProject.developerIds = fromProject.developerIds.filter(
              id => id !== change.developerId
            );
          }
        }

        // Add to new project
        if (change.toProjectId) {
          const toProject = updatedProjects.find(
            p => p.id === change.toProjectId
          );
          if (
            toProject &&
            !toProject.developerIds.includes(change.developerId)
          ) {
            toProject.developerIds.push(change.developerId);
          }
        }
      });

      return {
        projects: updatedProjects,
        pendingChanges: [],
        isConfirmationOpen: false,
      };
    });
  },

  cancelChanges: () => {
    set({
      pendingChanges: [],
      isConfirmationOpen: false,
    });
  },

  openConfirmation: () => {
    set({ isConfirmationOpen: true });
  },

  closeConfirmation: () => {
    set({ isConfirmationOpen: false });
  },

  setShowSimpleView: (value: boolean) => set({ showSimpleView: value }),
  getShowSimpleView: () => get().showSimpleView,

  // Helpers
  getProjectDevelopers: projectId => {
    const { projects, developers, pendingChanges } = get();
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];

    let developerIds = [...project.developerIds];

    // Apply pending changes for preview
    pendingChanges.forEach(change => {
      if (
        change.fromProjectId === projectId &&
        change.toProjectId !== projectId
      ) {
        // Developer leaving this project
        developerIds = developerIds.filter(id => id !== change.developerId);
      } else if (
        change.toProjectId === projectId &&
        change.fromProjectId !== projectId
      ) {
        // Developer joining this project
        if (!developerIds.includes(change.developerId)) {
          developerIds.push(change.developerId);
        }
      }
    });

    return developers.filter(dev => developerIds.includes(dev.id));
  },

  getUnassignedDevelopers: () => {
    const { projects, developers, pendingChanges } = get();
    const assignedIds = new Set(projects.flatMap(p => p.developerIds));

    let unassignedDevelopers = developers.filter(
      dev => !assignedIds.has(dev.id)
    );

    // Apply pending changes for preview
    pendingChanges.forEach(change => {
      if (change.fromProjectId && !change.toProjectId) {
        // Developer being unassigned
        const developer = developers.find(dev => dev.id === change.developerId);
        if (
          developer &&
          !unassignedDevelopers.find(dev => dev.id === change.developerId)
        ) {
          unassignedDevelopers.push(developer);
        }
      } else if (change.toProjectId && !change.fromProjectId) {
        // Developer being assigned from unassigned
        unassignedDevelopers = unassignedDevelopers.filter(
          dev => dev.id !== change.developerId
        );
      }
    });

    return unassignedDevelopers;
  },

  getDeveloperProject: developerId => {
    const { projects } = get();
    return (
      projects.find(project => project.developerIds.includes(developerId)) ||
      null
    );
  },
}));
