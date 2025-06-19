// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

// User types
export interface User extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
  emailVerified: boolean;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Life Area types
export interface LifeArea extends BaseEntity {
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LifeAreaAssessment extends BaseEntity {
  userId: string;
  lifeAreaId: string;
  year: number;
  quarter?: number;
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  keyAccomplishments?: string[];
  areasForImprovement?: string[];
  notes?: string;
  lifeArea?: LifeArea;
}

export interface LifeAreaMetric extends BaseEntity {
  userId: string;
  lifeAreaId: string;
  metricName: string;
  metricType: 'number' | 'percentage' | 'boolean' | 'scale';
  targetValue?: string;
  currentValue?: string;
  unit?: string;
  isActive: boolean;
  lifeArea?: LifeArea;
}

// Planning Session types
export interface PlanningSession extends BaseEntity {
  userId: string;
  year: number;
  status: 'in_progress' | 'completed' | 'archived';
  yearlyTheme?: string;
  lifePhilosophy?: string;
  idealFutureVision?: string;
  majorFocusAreas?: string[];
  completedAt?: string;
}

export interface MindMap extends BaseEntity {
  userId: string;
  planningSessionId?: string;
  title: string;
  type: 'life_status' | 'future_vision' | 'goals' | 'custom';
  data: string; // JSON string
}

export interface CalendarEvent extends BaseEntity {
  userId: string;
  planningSessionId?: string;
  majorGoalId?: string;
  title: string;
  description?: string;
  eventDate: string;
  eventType?: 'milestone' | 'deadline' | 'review' | 'focus_theme';
  isCompleted: boolean;
}

// Goal types
export interface MajorGoal extends BaseEntity {
  userId: string;
  planningSessionId?: string;
  title: string;
  description?: string;
  lifeAreaId?: string;
  priorityRank?: number;
  successCriteria?: string[];
  metrics?: Record<string, any>;
  targetCompletionDate?: string;
  isMetaSkill: boolean;
  status: 'active' | 'completed' | 'paused' | 'dropped';
  completionPercentage: number;
  lifeArea?: LifeArea;
  subProjects?: SubProject[];
  uncertainties?: GoalUncertainty[];
}

export interface SubProject extends BaseEntity {
  majorGoalId: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  dueDate?: string;
  completionPercentage: number;
  sortOrder?: number;
}

export interface GoalUncertainty extends BaseEntity {
  majorGoalId: string;
  uncertaintyDescription: string;
  reasons?: string;
  worstCaseScenario?: string;
  realityCheck?: string;
  actionPlan?: string;
}

// Review types
export interface ReviewSession extends BaseEntity {
  userId: string;
  planningSessionId?: string;
  type: 'monthly' | 'quarterly' | 'annual';
  year: number;
  month?: number;
  quarter?: number;
  goalProgressNotes?: string;
  whatWentWell?: string;
  whatWentPoorly?: string;
  adjustmentsNeeded?: string;
  priorityChanges?: Record<string, any>;
  overallSatisfaction?: number;
  completedAt?: string;
}

export interface ProgressEntry extends BaseEntity {
  userId: string;
  majorGoalId?: string;
  subProjectId?: string;
  entryDate: string;
  progressValue?: string;
  notes?: string;
  mood?: number;
}

// API types
export interface ApiError {
  detail: string;
  errorCode?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SuccessResponse {
  message: string;
  data?: Record<string, any>;
}

// Form types
export interface LifeAreaAssessmentCreate {
  lifeAreaId: string;
  year: number;
  quarter?: number;
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  keyAccomplishments?: string[];
  areasForImprovement?: string[];
  notes?: string;
}

export interface LifeAreaAssessmentUpdate {
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  keyAccomplishments?: string[];
  areasForImprovement?: string[];
  notes?: string;
}

export interface MajorGoalCreate {
  title: string;
  description?: string;
  lifeAreaId?: string;
  planningSessionId?: string;
  priorityRank?: number;
  successCriteria?: string[];
  targetCompletionDate?: string;
  isMetaSkill?: boolean;
}

export interface MajorGoalUpdate {
  title?: string;
  description?: string;
  lifeAreaId?: string;
  priorityRank?: number;
  successCriteria?: string[];
  targetCompletionDate?: string;
  status?: 'active' | 'completed' | 'paused' | 'dropped';
  completionPercentage?: number;
}

export interface PlanningSessionCreate {
  year: number;
  yearlyTheme?: string;
  lifePhilosophy?: string;
  idealFutureVision?: string;
  majorFocusAreas?: string[];
}

export interface PlanningSessionUpdate {
  yearlyTheme?: string;
  lifePhilosophy?: string;
  idealFutureVision?: string;
  majorFocusAreas?: string[];
  status?: 'in_progress' | 'completed' | 'archived';
}

// Dashboard types
export interface DashboardOverview {
  currentSession?: PlanningSession;
  recentSessions: PlanningSession[];
  upcomingEvents: CalendarEvent[];
  progressSummary: Record<string, any>;
}

export interface GoalsOverview {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  pausedGoals: number;
  droppedGoals: number;
  averageCompletion: number;
  goalsByLifeArea: Record<string, number>;
  upcomingDeadlines: MajorGoal[];
}

export interface ProgressAnalytics {
  periodStart: string;
  periodEnd: string;
  totalEntries: number;
  averageMood?: number;
  mostActiveGoals: Array<{ goalId: string; entries: number }>;
  progressTrends: Record<string, any>;
  insights: string[];
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormState<T> extends LoadingState {
  data?: T;
  isDirty: boolean;
  isValid: boolean;
}

// Navigation types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Chart types
export interface ChartData {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'pie' | 'radar';
  data: ChartData[];
  xAxisKey: string;
  yAxisKey: string;
  title?: string;
  description?: string;
}
