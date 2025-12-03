// src/types/index.ts

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'active' | 'completed';

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    createdAt: Date;
    deadline?: Date;
    priority: Priority;
    status: TaskStatus;
    category?: string;
    tags?: string[];
}

export interface User {
    id: string;
    email: string;
    displayName?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    filter: {
        status: 'all' | TaskStatus;
        priority?: Priority;
        category?: string;
    };
    sortBy: 'smart' | 'deadline' | 'priority' | 'created';
}

export interface RootState {
    auth: AuthState;
    tasks: TaskState;
}

// Navigation Types
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    TaskDetails: { taskId: string };
    AddTask: undefined;
    EditTask: { taskId: string };
};