
// FAKE DATABASE
// let MOCK_TASKS: Task[] = [
//     {
//         id: '1',
//         userId: 'user-123',
//         title: 'Welcome to TodoMaster',
//         description: 'This is a sample task to show the UI.',
//         createdAt: new Date(),
//         deadline: new Date(Date.now() + 86400000), // Tomorrow
//         priority: 'high',
//         status: 'active',
//         category: 'General',
//     }
// ];

// class TaskService {
//     async getUserTasks(userId: string): Promise<Task[]> {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return [...MOCK_TASKS];
//     }

//     async createTask(task: Omit<Task, 'id'>): Promise<Task> {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         const newTask: Task = {
//         ...task,
//         id: Math.random().toString(36).substr(2, 9),
//         };
//         MOCK_TASKS.push(newTask);
//         return newTask;
//     }

//     async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
//         MOCK_TASKS = MOCK_TASKS.map(t => 
//         t.id === taskId ? { ...t, ...updates } : t
//         );
//     }

//     async deleteTask(taskId: string): Promise<void> {
//         MOCK_TASKS = MOCK_TASKS.filter(t => t.id !== taskId);
//     }

//     async toggleTaskStatus(taskId: string, currentStatus: 'active' | 'completed'): Promise<void> {
//         const newStatus = currentStatus === 'active' ? 'completed' : 'active';
//         await this.updateTask(taskId, { status: newStatus });
//     }

//     // Fake subscription so the Home Screen doesn't crash
//     subscribeToTasks(userId: string, onUpdate: (tasks: Task[]) => void): () => void {
//         // Return current tasks immediately
//         onUpdate([...MOCK_TASKS]);
//         // Return a dummy unsubscribe function
//         return () => {};
//     }
// }

// export default new TaskService();


import firestore from '@react-native-firebase/firestore';
import { Task } from '../types/ index';

const TASKS_COLLECTION = 'tasks';

class TaskService {
    async getUserTasks(userId: string): Promise<Task[]> {
        const snapshot = await firestore()
        .collection(TASKS_COLLECTION)
        .where('userId', '==', userId)
        .get();

        return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        deadline: doc.data().deadline ? doc.data().deadline.toDate() : undefined,
        })) as Task[];
    }

    async createTask(task: Omit<Task, 'id'>): Promise<Task> {
        const docRef = await firestore().collection(TASKS_COLLECTION).add({
        ...task,
        createdAt: firestore.Timestamp.now(),
        deadline: task.deadline ? firestore.Timestamp.fromDate(task.deadline) : null,
        });

        return { id: docRef.id, ...task };
    }

    async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
        const updateData: any = { ...updates };
        if (updates.deadline) {
        updateData.deadline = firestore.Timestamp.fromDate(updates.deadline);
        }
        await firestore().collection(TASKS_COLLECTION).doc(taskId).update(updateData);
    }

    async deleteTask(taskId: string): Promise<void> {
        await firestore().collection(TASKS_COLLECTION).doc(taskId).delete();
    }

    async toggleTaskStatus(taskId: string, currentStatus: string): Promise<void> {
        const newStatus = currentStatus === 'active' ? 'completed' : 'active';
        await firestore().collection(TASKS_COLLECTION).doc(taskId).update({ status: newStatus });
    }

    subscribeToTasks(userId: string, onUpdate: (tasks: Task[]) => void, onError: (err: Error) => void): () => void {
        return firestore()
        .collection(TASKS_COLLECTION)
        .where('userId', '==', userId)
        .onSnapshot(
            (snapshot) => {
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                deadline: doc.data().deadline ? doc.data().deadline.toDate() : undefined,
            })) as Task[];
            onUpdate(tasks);
            },
            onError
        );
    }
}

export default new TaskService();