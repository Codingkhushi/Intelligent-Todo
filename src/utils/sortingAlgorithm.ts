// src/utils/sortingAlgorithm.ts

import { Task } from '../types/ index';
import { PRIORITY_WEIGHTS } from './constants';

export const sortTasks = (tasks: Task[], sortBy: string): Task[] => {
    return [...tasks].sort((a, b) => {
        // 1. Always move Completed tasks to the bottom
        if (a.status !== b.status) {
        return a.status === 'completed' ? 1 : -1;
        }

        // 2. Handle specific sort modes
        switch (sortBy) {
        case 'deadline':
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

        case 'priority':
            return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];

        case 'created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case 'smart':
        default:
            // --- SMART ALGORITHM (BONUS) ---
            // Formula: Score = (PriorityWeight * LargeNumber) - (TimeUntilDeadline)
            // Result: High priority items due soon get the highest score.
            
            const now = new Date().getTime();
            
            // Calculate Time Weight (Deadline - Now). Smaller is more urgent.
            // If no deadline, treat as very far in future
            const timeA = a.deadline ? new Date(a.deadline).getTime() - now : 9999999999;
            const timeB = b.deadline ? new Date(b.deadline).getTime() - now : 9999999999;

            // Calculate Priority Weight
            const pWeightA = PRIORITY_WEIGHTS[a.priority];
            const pWeightB = PRIORITY_WEIGHTS[b.priority];

            // We give Priority a heavy weight (100 days worth of milliseconds)
            // so a High priority item is usually above a Low priority item,
            // unless the Low priority item is VERY overdue.
            const scoreA = (pWeightA * 8640000000) - timeA;
            const scoreB = (pWeightB * 8640000000) - timeB;

            return scoreB - scoreA;
        }
    });
};