import { create } from 'zustand';

export interface Developer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  status: 'activo' | 'disponible' | 'vacaciones';
  seniority: 'junior' | 'mid' | 'senior' | 'staff';
  role: 'developer' | 'tech-lead'; // Roles reales
  functions: ('squad-lead' | 'staff-engineer')[]; // Funciones que puede ejercer
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement';
  yearsOfExperience: number;
}

export interface Project {
  id: string;
  name: string;
  status: 'activo' | 'completado' | 'en-pausa';
  deadline: string;
  description: string;
  requiredSkills: string[];
  developerIds: string[];
  squadLeadId?: string; // ID del desarrollador que actúa como squad lead en este proyecto
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

  // Squad Lead & Staff Engineer actions
  assignSquadLead: (projectId: string, developerId: string) => void;
  removeSquadLead: (projectId: string) => void;
  getProjectSquadLead: (projectId: string) => Developer | null;
  getSquadLeadProjects: (developerId: string) => Project[];
  getStaffEngineeerProjects: (developerId: string) => Project[];
  isDeveloperFunction: (
    developerId: string,
    functionType: 'squad-lead' | 'staff-engineer'
  ) => boolean;

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
      description: 'Plataforma de gestión de proyectos con dashboard avanzado',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      developerIds: ['1', '2', '3', '4', '5', '6', '67'], // Incluye Carlos Problemático
      squadLeadId: '1', // Juan Carlos actúa como Squad Lead
    },
    {
      id: '2',
      name: 'E-commerce App',
      status: 'activo',
      deadline: '2024-02-20',
      description: 'Aplicación de comercio electrónico con microservicios',
      requiredSkills: ['Vue.js', 'Python', 'PostgreSQL', 'Redis'],
      developerIds: ['7', '8', '9', '10', '11', '12', '13', '2'], // María Elena como Staff Engineer
      squadLeadId: '8', // Elena actúa como Squad Lead
    },
    {
      id: '3',
      name: 'CRM System',
      status: 'activo',
      deadline: '2024-04-10',
      description: 'Sistema de gestión de clientes con IA',
      requiredSkills: ['Angular', 'Java', 'MySQL', 'TensorFlow'],
      developerIds: ['14', '15', '16', '17', '18', '69'], // Incluye Pedro Incompleto
      squadLeadId: '14', // Gabriela actúa como Squad Lead
    },
    {
      id: '4',
      name: 'Mobile Banking App',
      status: 'activo',
      deadline: '2024-05-30',
      description: 'Aplicación bancaria móvil con máxima seguridad',
      requiredSkills: [
        'React Native',
        'Flutter',
        'Kotlin',
        'Swift',
        'Blockchain',
      ],
      developerIds: ['19', '20', '21', '22', '23', '24', '25', '26', '4'], // Ana Isabel como Staff Engineer
      squadLeadId: '24', // Lucía actúa como Squad Lead
    },
    {
      id: '5',
      name: 'IoT Dashboard',
      status: 'activo',
      deadline: '2024-06-15',
      description: 'Dashboard para monitoreo de dispositivos IoT',
      requiredSkills: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Docker'],
      developerIds: ['27', '28', '29', '30', '31', '32', '8'], // Elena como Staff Engineer en múltiples proyectos
      squadLeadId: '31', // Ignacio actúa como Squad Lead
    },
    {
      id: '6',
      name: 'Healthcare Platform',
      status: 'en-pausa',
      deadline: '2024-07-20',
      description: 'Plataforma de telemedicina y gestión hospitalaria',
      requiredSkills: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'FHIR'],
      developerIds: ['33', '34', '35', '36'],
      squadLeadId: '35', // Maximiliano actúa como Squad Lead
    },
    {
      id: '7',
      name: 'AI Analytics Tool',
      status: 'activo',
      deadline: '2024-08-10',
      description: 'Herramienta de análisis predictivo con machine learning',
      requiredSkills: ['Python', 'TensorFlow', 'Pandas', 'React', 'AWS'],
      developerIds: ['37', '38', '39', '40', '41', '42', '43', '73'], // Incluye Miguel Líder Problemático
      squadLeadId: '73', // Miguel como Squad Lead con problemas
    },
    {
      id: '8',
      name: 'Blockchain Wallet',
      status: 'completado',
      deadline: '2024-01-15',
      description: 'Wallet de criptomonedas con staking',
      requiredSkills: ['Solidity', 'Web3.js', 'React', 'Node.js'],
      developerIds: ['44', '45', '46'],
      squadLeadId: '45', // Nicolás actúa como Squad Lead
    },
    {
      id: '9',
      name: 'Learning Management System',
      status: 'activo',
      deadline: '2024-09-30',
      description: 'Plataforma educativa con gamificación',
      requiredSkills: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
      developerIds: ['47', '48', '49', '50', '70'], // Ana Líder Squad asignada
      squadLeadId: '70', // Ana como Squad Lead
    },
    {
      id: '10',
      name: 'DevOps Automation',
      status: 'activo',
      deadline: '2024-10-25',
      description: 'Suite de herramientas para CI/CD y monitoreo',
      requiredSkills: ['Go', 'Kubernetes', 'Terraform', 'Prometheus'],
      developerIds: ['51', '52', '53', '72'], // Sofia Staff Engineer asignada
      squadLeadId: '72', // Sofia como Squad Lead y Staff Engineer
    },
  ],

  developers: [
    // Frontend Developers
    {
      id: '1',
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@dev.com',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['squad-lead', 'staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '2',
      name: 'María Elena García',
      email: 'maria.garcia@dev.com',
      skills: ['React', 'Python', 'Django', 'PostgreSQL', 'AWS'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '3',
      name: 'Carlos Alberto López',
      email: 'carlos.lopez@dev.com',
      skills: ['Vue.js', 'Python', 'FastAPI', 'MongoDB', 'Docker'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '4',
      name: 'Ana Isabel Martínez',
      email: 'ana.martinez@dev.com',
      skills: ['Angular', 'Java', 'Spring', 'MySQL', 'Kubernetes'],
      status: 'activo',
      seniority: 'staff',
      role: 'tech-lead',
      functions: ['squad-lead', 'staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 7,
    },
    {
      id: '5',
      name: 'Luis Fernando Torres',
      email: 'luis.torres@dev.com',
      skills: ['React Native', 'Flutter', 'Firebase', 'Swift', 'Kotlin'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '6',
      name: 'Carmen Patricia Ruiz',
      email: 'carmen.ruiz@dev.com',
      skills: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Cypress'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '7',
      name: 'Roberto Manuel Silva',
      email: 'roberto.silva@dev.com',
      skills: ['Vue.js', 'Nuxt.js', 'Vuex', 'Sass', 'Webpack'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '8',
      name: 'Elena Beatriz Vásquez',
      email: 'elena.vasquez@dev.com',
      skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 6,
    },
    {
      id: '9',
      name: 'Diego Alejandro Morales',
      email: 'diego.morales@dev.com',
      skills: ['Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '10',
      name: 'Patricia Soledad Herrera',
      email: 'patricia.herrera@dev.com',
      skills: ['React', 'Redux', 'Styled Components', 'Storybook', 'Figma'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '11',
      name: 'Fernando Rodrigo Castro',
      email: 'fernando.castro@dev.com',
      skills: ['Vue.js', 'Python', 'FastAPI', 'Docker', 'Nginx'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '12',
      name: 'Sofía Esperanza Mendoza',
      email: 'sofia.mendoza@dev.com',
      skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Material UI'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '13',
      name: 'Alejandro Gabriel Díaz',
      email: 'alejandro.diaz@dev.com',
      skills: ['Node.js', 'Nest.js', 'TypeORM', 'PostgreSQL', 'Swagger'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '14',
      name: 'Gabriela Lorena Ramos',
      email: 'gabriela.ramos@dev.com',
      skills: ['Angular', 'Java', 'Spring Boot', 'Hibernate', 'MySQL'],
      status: 'activo',
      seniority: 'senior',
      role: 'tech-lead',
      functions: ['squad-lead', 'staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 8,
    },
    {
      id: '15',
      name: 'Miguel Ángel Cruz',
      email: 'miguel.cruz@dev.com',
      skills: ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Jupyter'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '16',
      name: 'Valentina Nicole Jiménez',
      email: 'valentina.jimenez@dev.com',
      skills: ['React', 'D3.js', 'Chart.js', 'Python', 'NumPy'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '17',
      name: 'Andrés Sebastián Vargas',
      email: 'andres.vargas@dev.com',
      skills: ['Java', 'Spring', 'Maven', 'JUnit', 'Oracle'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '18',
      name: 'Isabella Fernanda Cordero',
      email: 'isabella.cordero@dev.com',
      skills: ['Angular', 'TypeScript', 'Jasmine', 'Karma', 'Protractor'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '19',
      name: 'Ricardo Esteban Peña',
      email: 'ricardo.pena@dev.com',
      skills: ['React Native', 'iOS', 'Swift', 'Xcode', 'TestFlight'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '20',
      name: 'Camila Antonia Ortega',
      email: 'camila.ortega@dev.com',
      skills: ['Flutter', 'Dart', 'Android', 'Kotlin', 'Firebase'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '21',
      name: 'Sebastián Guerrero',
      email: 'sebastian.guerrero@dev.com',
      skills: ['React Native', 'Redux', 'AsyncStorage', 'Expo', 'Jest'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '22',
      name: 'Natalia Romero',
      email: 'natalia.romero@dev.com',
      skills: ['Swift', 'UIKit', 'Core Data', 'Combine', 'SwiftUI'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '23',
      name: 'Javier Molina',
      email: 'javier.molina@dev.com',
      skills: ['Kotlin', 'Android', 'Room', 'Retrofit', 'Dagger'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '24',
      name: 'Lucía Aguilar',
      email: 'lucia.aguilar@dev.com',
      skills: ['Solidity', 'Web3.js', 'Ethereum', 'Truffle', 'Ganache'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '25',
      name: 'Emilio Santos',
      email: 'emilio.santos@dev.com',
      skills: ['Flutter', 'Bloc', 'Dio', 'Hive', 'GetIt'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '26',
      name: 'Adriana Flores',
      email: 'adriana.flores@dev.com',
      skills: ['React Native', 'TypeScript', 'MobX', 'Detox', 'Flipper'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '27',
      name: 'Óscar Medina',
      email: 'oscar.medina@dev.com',
      skills: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '28',
      name: 'Daniela Campos',
      email: 'daniela.campos@dev.com',
      skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '29',
      name: 'Mauricio Restrepo',
      email: 'mauricio.restrepo@dev.com',
      skills: ['Node.js', 'Express', 'Socket.io', 'Redis', 'Docker'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '30',
      name: 'Valeria Rojas',
      email: 'valeria.rojas@dev.com',
      skills: ['React', 'Recharts', 'Material-UI', 'Formik', 'Yup'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '31',
      name: 'Ignacio Paredes',
      email: 'ignacio.paredes@dev.com',
      skills: ['Go', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 6,
    },
    {
      id: '32',
      name: 'Renata Salinas',
      email: 'renata.salinas@dev.com',
      skills: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'Pytest'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '33',
      name: 'Tomás Herrera',
      email: 'tomas.herrera@dev.com',
      skills: ['Vue.js', 'Vuetify', 'Axios', 'Vue Router', 'Vuex'],
      status: 'disponible',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 1,
    },
    {
      id: '34',
      name: 'Constanza Vega',
      email: 'constanza.vega@dev.com',
      skills: ['Python', 'Django', 'DRF', 'Celery', 'PostgreSQL'],
      status: 'disponible',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '35',
      name: 'Maximiliano Torres',
      email: 'maximiliano.torres@dev.com',
      skills: ['Node.js', 'Fastify', 'Prisma', 'GraphQL', 'Apollo'],
      status: 'disponible',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '36',
      name: 'Antonia Espinoza',
      email: 'antonia.espinoza@dev.com',
      skills: ['React', 'Next.js', 'Vercel', 'Stripe', 'Auth0'],
      status: 'disponible',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '37',
      name: 'Benjamín Núñez',
      email: 'benjamin.nunez@dev.com',
      skills: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-learn'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 6,
    },
    {
      id: '38',
      name: 'Francisca Miranda',
      email: 'francisca.miranda@dev.com',
      skills: ['Python', 'Pandas', 'Matplotlib', 'Jupyter', 'AWS'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '39',
      name: 'Cristóbal Soto',
      email: 'cristobal.soto@dev.com',
      skills: ['React', 'D3.js', 'Observable', 'Plotly', 'Deck.gl'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '40',
      name: 'Martina Fuentes',
      email: 'martina.fuentes@dev.com',
      skills: ['Python', 'MLflow', 'Kubeflow', 'Docker', 'Kubernetes'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '41',
      name: 'Felipe Muñoz',
      email: 'felipe.munoz@dev.com',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'AWS Lambda'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '42',
      name: 'Javiera Contreras',
      email: 'javiera.contreras@dev.com',
      skills: ['Python', 'FastAPI', 'Pydantic', 'Uvicorn', 'Gunicorn'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '43',
      name: 'Rodrigo Castillo',
      email: 'rodrigo.castillo@dev.com',
      skills: ['React', 'TypeScript', 'Recharts', 'Framer Motion', 'Vite'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '44',
      name: 'Isidora Parra',
      email: 'isidora.parra@dev.com',
      skills: ['Solidity', 'Hardhat', 'Ethers.js', 'OpenZeppelin', 'IPFS'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '45',
      name: 'Nicolás Bravo',
      email: 'nicolas.bravo@dev.com',
      skills: ['React', 'Web3.js', 'MetaMask', 'WalletConnect', 'Ethers'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '46',
      name: 'Amparo Lagos',
      email: 'amparo.lagos@dev.com',
      skills: ['Node.js', 'Web3.js', 'Infura', 'Alchemy', 'Moralis'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '47',
      name: 'Esteban Ramírez',
      email: 'esteban.ramirez@dev.com',
      skills: ['Next.js', 'Prisma', 'tRPC', 'NextAuth', 'Tailwind'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'average',
      yearsOfExperience: 2,
    },
    {
      id: '48',
      name: 'Florencia Godoy',
      email: 'florencia.godoy@dev.com',
      skills: ['React', 'Framer Motion', 'Three.js', 'GSAP', 'Lottie'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '49',
      name: 'Agustín Moreno',
      email: 'agustin.moreno@dev.com',
      skills: ['Node.js', 'Stripe', 'PayPal', 'Mercado Pago', 'WebRTC'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '50',
      name: 'Colomba Sepúlveda',
      email: 'colomba.sepulveda@dev.com',
      skills: ['PostgreSQL', 'Prisma', 'Supabase', 'Redis', 'Elasticsearch'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '51',
      name: 'Matías Ibarra',
      email: 'matias.ibarra@dev.com',
      skills: ['Go', 'Gin', 'GORM', 'Docker', 'Kubernetes'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 6,
    },
    {
      id: '52',
      name: 'Esperanza Maldonado',
      email: 'esperanza.maldonado@dev.com',
      skills: ['Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'AWS'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'good',
      yearsOfExperience: 4,
    },
    {
      id: '53',
      name: 'Gaspar Figueroa',
      email: 'gaspar.figueroa@dev.com',
      skills: ['Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'ELK Stack'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'excellent',
      yearsOfExperience: 7,
    },
    // Desarrolladores disponibles (sin asignar) - Con más variedad de performance y roles
    {
      id: '54',
      name: 'Belén Tapia',
      email: 'belen.tapia@dev.com',
      skills: ['React', 'TypeScript', 'Zustand', 'React Query', 'Vite'],
      status: 'disponible',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 1,
    },
    {
      id: '55',
      name: 'Clemente Sandoval',
      email: 'clemente.sandoval@dev.com',
      skills: ['Vue.js', 'Pinia', 'Vite', 'Vitest', 'Cypress'],
      status: 'disponible',
      seniority: 'mid',
      role: 'developer',
      functions: ['squad-lead'],
      performance: 'good',
      yearsOfExperience: 3,
    },
    {
      id: '56',
      name: 'Paloma Carrasco',
      email: 'paloma.carrasco@dev.com',
      skills: ['Angular', 'NgRx', 'Angular Material', 'Karma', 'Protractor'],
      status: 'disponible',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 1,
    },
    {
      id: '57',
      name: 'Salvador Henríquez',
      email: 'salvador.henriquez@dev.com',
      skills: ['Python', 'Django', 'Channels', 'Celery', 'Redis'],
      status: 'disponible',
      seniority: 'senior',
      role: 'tech-lead',
      functions: [],
      performance: 'excellent',
      yearsOfExperience: 3,
    },
    {
      id: '58',
      name: 'Magdalena Araya',
      email: 'magdalena.araya@dev.com',
      skills: ['Node.js', 'Nest.js', 'Prisma', 'GraphQL', 'TypeScript'],
      status: 'disponible',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 2,
    },
    {
      id: '59',
      name: 'Alonso Vergara',
      email: 'alonso.vergara@dev.com',
      skills: [
        'React Native',
        'Expo',
        'Supabase',
        'React Navigation',
        'Reanimated',
      ],
      status: 'disponible',
      seniority: 'staff',
      role: 'developer',
      functions: ['staff-engineer'],
      performance: 'good',
      yearsOfExperience: 6,
    },
    {
      id: '60',
      name: 'Trinidad Cáceres',
      email: 'trinidad.caceres@dev.com',
      skills: ['Flutter', 'Riverpod', 'Freezed', 'Auto Route', 'Dio'],
      status: 'vacaciones',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 1,
    },
    // Agregando más desarrolladores con performance y roles específicos
    {
      id: '61',
      name: 'Rodrigo Fernández',
      email: 'rodrigo.fernandez@dev.com',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Jest'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 2,
    },
    {
      id: '62',
      name: 'Valentina Morales',
      email: 'valentina.morales@dev.com',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      status: 'disponible',
      seniority: 'senior',
      role: 'developer',
      functions: ['squad-lead'],
      performance: 'excellent',
      yearsOfExperience: 5,
    },
    {
      id: '63',
      name: 'Sebastián Rojas',
      email: 'sebastian.rojas@dev.com',
      skills: ['JavaScript', 'HTML', 'CSS', 'Bootstrap', 'jQuery'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 1,
    },
    {
      id: '64',
      name: 'Carolina Venegas',
      email: 'carolina.venegas@dev.com',
      skills: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Terraform'],
      status: 'disponible',
      seniority: 'staff',
      role: 'tech-lead',
      functions: [],
      performance: 'excellent',
      yearsOfExperience: 8,
    },
    {
      id: '65',
      name: 'Manuel Espinoza',
      email: 'manuel.espinoza@dev.com',
      skills: ['Vue.js', 'PHP', 'MySQL', 'Laravel', 'Composer'],
      status: 'activo',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement',
      yearsOfExperience: 3,
    },
    {
      id: '66',
      name: 'Andrea Castillo',
      email: 'andrea.castillo@dev.com',
      skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Jasmine'],
      status: 'disponible',
      seniority: 'senior',
      role: 'developer',
      functions: ['squad-lead'],
      performance: 'good',
      yearsOfExperience: 6,
    },
    // EJEMPLOS ESPECÍFICOS PARA DEMOSTRACIÓN
    // ⚠️ Desarrolladores con TARJETA AMARILLA (needs-improvement performance)
    {
      id: '67',
      name: 'Carlos Problemático',
      email: 'carlos.problematico@dev.com',
      skills: ['React', 'JavaScript', 'CSS'],
      status: 'activo',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement', // ⚠️ TARJETA AMARILLA
      yearsOfExperience: 1,
    },
    {
      id: '68',
      name: 'María Lenta',
      email: 'maria.lenta@dev.com',
      skills: ['Vue.js', 'PHP', 'MySQL'],
      status: 'disponible',
      seniority: 'mid',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement', // ⚠️ TARJETA AMARILLA
      yearsOfExperience: 2,
    },
    {
      id: '69',
      name: 'Pedro Incompleto',
      email: 'pedro.incompleto@dev.com',
      skills: ['Angular', 'TypeScript'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement', // ⚠️ TARJETA AMARILLA
      yearsOfExperience: 4,
    },
    // 👑 LÍDERES con BADGES PÚRPURA
    {
      id: '70',
      name: 'Ana Líder Squad',
      email: 'ana.lider@dev.com',
      skills: ['React', 'Node.js', 'Leadership', 'Agile', 'Mentoring'],
      status: 'activo',
      seniority: 'senior',
      role: 'developer',
      functions: ['squad-lead'],
      performance: 'excellent',
      yearsOfExperience: 6,
    },
    {
      id: '71',
      name: 'Roberto Tech Lead',
      email: 'roberto.techlead@dev.com',
      skills: ['React', 'TypeScript', 'Architecture', 'AWS', 'Team Management'],
      status: 'disponible',
      seniority: 'staff',
      role: 'tech-lead', // 👑 LÍDER - Badge púrpura
      functions: [],
      performance: 'excellent',
      yearsOfExperience: 8,
    },
    {
      id: '72',
      name: 'Sofia Staff Engineer',
      email: 'sofia.staff@dev.com',
      skills: [
        'React',
        'Node.js',
        'System Design',
        'Kubernetes',
        'Microservices',
      ],
      status: 'activo',
      seniority: 'staff',
      role: 'developer',
      functions: ['staff-engineer', 'squad-lead'],
      performance: 'excellent',
      yearsOfExperience: 10,
    },
    // 👑 LÍDER con TARJETA AMARILLA (caso especial para demostrar ambos)
    {
      id: '73',
      name: 'Miguel Líder Problemático',
      email: 'miguel.lider.problematico@dev.com',
      skills: ['Java', 'Spring', 'Leadership'],
      status: 'activo',
      seniority: 'senior',
      role: 'tech-lead', // 👑 LÍDER - Badge púrpura
      functions: [],
      performance: 'needs-improvement', // ⚠️ TARJETA AMARILLA
      yearsOfExperience: 7,
    },
    // Desarrolladores disponibles con características específicas
    {
      id: '74',
      name: 'Laura Sin Asignar Problema',
      email: 'laura.problema@dev.com',
      skills: ['React', 'CSS', 'HTML'],
      status: 'disponible',
      seniority: 'junior',
      role: 'developer',
      functions: [],
      performance: 'needs-improvement', // ⚠️ TARJETA AMARILLA
      yearsOfExperience: 1,
    },
    {
      id: '75',
      name: 'David Squad Lead Disponible',
      email: 'david.squadlead@dev.com',
      skills: ['Vue.js', 'Node.js', 'Team Leadership', 'Scrum', 'Coaching'],
      status: 'disponible',
      seniority: 'senior',
      role: 'developer',
      functions: ['squad-lead'],
      performance: 'good',
      yearsOfExperience: 5,
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

  // Squad Lead & Staff Engineer actions
  assignSquadLead: (projectId, developerId) => {
    set(state => {
      const updatedProjects = state.projects.map(project => {
        if (project.id === projectId) {
          return { ...project, squadLeadId: developerId };
        }
        return project;
      });

      return {
        projects: updatedProjects,
      };
    });
  },

  removeSquadLead: projectId => {
    set(state => {
      const updatedProjects = state.projects.map(project => {
        if (project.id === projectId) {
          return { ...project, squadLeadId: undefined };
        }
        return project;
      });

      return {
        projects: updatedProjects,
      };
    });
  },

  getProjectSquadLead: projectId => {
    const { projects, developers } = get();
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.squadLeadId) return null;

    return developers.find(dev => dev.id === project.squadLeadId) || null;
  },

  getSquadLeadProjects: developerId => {
    const { projects } = get();
    return projects.filter(project => project.squadLeadId === developerId);
  },

  getStaffEngineeerProjects: developerId => {
    const { projects } = get();
    return projects.filter(project =>
      project.developerIds.includes(developerId)
    );
  },

  isDeveloperFunction: (developerId, functionType) => {
    const { developers } = get();
    const developer = developers.find(dev => dev.id === developerId);
    if (!developer) return false;

    return developer.functions.includes(functionType);
  },

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
