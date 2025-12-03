// src/redux/slices/taskSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../../types/ index';

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    filter: {
        status: 'all',
        priority: undefined,
        category: undefined,
    },
    sortBy: 'smart',
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
        },
        addTask: (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
            state.tasks[index] = action.payload;
        }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
        state.loading = false;
        },
        setFilter: (state, action: PayloadAction<Partial<TaskState['filter']>>) => {
        state.filter = { ...state.filter, ...action.payload };
        },
        setSortBy: (state, action: PayloadAction<TaskState['sortBy']>) => {
        state.sortBy = action.payload;
        },
    },
});

export const {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
    setError,
    setFilter,
    setSortBy,
} = taskSlice.actions;

export default taskSlice.reducer;