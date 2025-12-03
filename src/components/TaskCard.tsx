// src/components/TaskCard.tsx

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Task, Priority } from '../types/ index';
import { updateTask, deleteTask } from '../redux/slices/taskSlice';
import taskService from '../services/taskService';

interface TaskCardProps {
    task: Task;
    navigation: any;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, navigation }) => {
    const dispatch = useDispatch();

  /**
   * Get priority color
   */
    const getPriorityColor = (priority: Priority): string => {
        switch (priority) {
        case 'high':
            return '#FF3B30';
        case 'medium':
            return '#FF9500';
        case 'low':
            return '#34C759';
        default:
            return '#999';
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (date?: Date): string => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        });
    };

    /**
     * Check if task is overdue
     */
    const isOverdue = (): boolean => {
        if (!task.deadline || task.status === 'completed') return false;
        return new Date(task.deadline) < new Date();
    };

    /**
     * Toggle task completion status
     */
    const handleToggleComplete = async () => {
        try {
        await taskService.toggleTaskStatus(task.id, task.status);
        const updatedTask = {
            ...task,
            status: task.status === 'active' ? 'completed' : 'active',
        } as Task;
        dispatch(updateTask(updatedTask));
        } catch (error: any) {
        Alert.alert('Error', error.message);
        }
    };

    /**
     * Delete task with confirmation
     */
    const handleDelete = () => {
        Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
                try {
                await taskService.deleteTask(task.id);
                dispatch(deleteTask(task.id));
                } catch (error: any) {
                Alert.alert('Error', error.message);
                }
            },
            },
        ]
        );
    };

    const priorityColor = getPriorityColor(task.priority);
    const overdue = isOverdue();

    return (
        <TouchableOpacity
        style={[
            styles.card,
            task.status === 'completed' && styles.cardCompleted,
        ]}
        onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
        activeOpacity={0.7}>
        {/* Priority Indicator */}
        <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

        <View style={styles.content}>
            {/* Header Row */}
            <View style={styles.header}>
            {/* Checkbox */}
            <TouchableOpacity
                onPress={handleToggleComplete}
                style={styles.checkbox}>
                {task.status === 'completed' ? (
                <Icon name="checkmark-circle" size={28} color="#34C759" />
                ) : (
                <Icon name="ellipse-outline" size={28} color="#999" />
                )}
            </TouchableOpacity>

            {/* Task Info */}
            <View style={styles.taskInfo}>
                <Text
                style={[
                    styles.title,
                    task.status === 'completed' && styles.titleCompleted,
                ]}
                numberOfLines={2}>
                {task.title}
                </Text>
                {task.description && (
                <Text
                    style={styles.description}
                    numberOfLines={2}>
                    {task.description}
                </Text>
                )}
            </View>

            {/* Delete Button */}
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Icon name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
            </View>

            {/* Footer Row */}
            <View style={styles.footer}>
            {/* Priority Badge */}
            <View style={[styles.badge, { backgroundColor: priorityColor }]}>
                <Text style={styles.badgeText}>
                {task.priority.toUpperCase()}
                </Text>
            </View>

            {/* Deadline */}
            {task.deadline && (
                <View style={styles.deadlineContainer}>
                <Icon
                    name="calendar-outline"
                    size={14}
                    color={overdue ? '#FF3B30' : '#666'}
                />
                <Text style={[styles.deadline, overdue && styles.overdue]}>
                    {formatDate(task.deadline)}
                </Text>
                {overdue && (
                    <Text style={styles.overdueLabel}>OVERDUE</Text>
                )}
                </View>
            )}
            </View>
        </View>
        </TouchableOpacity>
    );
    };

    const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardCompleted: {
        opacity: 0.6,
    },
    priorityBar: {
        height: 4,
        width: '100%',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    checkbox: {
        marginRight: 12,
        marginTop: 2,
    },
    taskInfo: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    deleteButton: {
        padding: 4,
        marginLeft: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deadline: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    overdue: {
        color: '#FF3B30',
        fontWeight: '600',
    },
    overdueLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FF3B30',
        marginLeft: 6,
    },
});

export default TaskCard;