// src/screens/TaskDetailsScreen.tsx

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTask } from '../redux/slices/taskSlice';
import { RootState } from '../redux/store';
import taskService from '../services/taskService';
import { Priority, RootStackParamList } from '../types/ index';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
    const { taskId } = route.params;
    const dispatch = useDispatch();
    
    // Find the specific task from Redux store
    const task = useSelector((state: RootState) =>
        state.tasks.tasks.find((t) => t.id === taskId)
    );

    // If task not found (e.g., deleted), go back
    if (!task) {
        navigation.goBack();
        return null;
    }

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
        case 'high': return '#FF3B30';
        case 'medium': return '#FF9500';
        case 'low': return '#34C759';
        default: return '#999';
        }
    };

    const handleToggleStatus = async () => {
        try {
        await taskService.toggleTaskStatus(task.id, task.status);
        dispatch(updateTask({
            ...task,
            status: task.status === 'active' ? 'completed' : 'active',
        }));
        } catch (error: any) {
        Alert.alert('Error', error.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task? This action cannot be undone.',
        [
            { text: 'Cancel', style: 'cancel' },
            {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
                try {
                await taskService.deleteTask(task.id);
                dispatch(deleteTask(task.id));
                navigation.goBack();
                } catch (error: any) {
                Alert.alert('Error', error.message);
                }
            },
            },
        ]
        );
    };

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            
            {/* Status Header */}
            <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, task.status === 'completed' ? styles.bgSuccess : styles.bgActive]}>
                <Text style={styles.statusText}>
                {task.status === 'completed' ? 'COMPLETED' : 'ACTIVE'}
                </Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: getPriorityColor(task.priority) }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority.toUpperCase()} PRIORITY
                </Text>
            </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{task.title}</Text>

            {/* Date Info */}
            <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
                <Icon name="time-outline" size={20} color="#666" />
                <Text style={styles.metaText}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
                </Text>
            </View>
            
            {task.deadline && (
                <View style={styles.metaRow}>
                <Icon name="calendar-outline" size={20} color={new Date(task.deadline) < new Date() && task.status !== 'completed' ? '#FF3B30' : '#666'} />
                <Text style={[styles.metaText, new Date(task.deadline) < new Date() && task.status !== 'completed' && styles.textDanger]}>
                    Deadline: {new Date(task.deadline).toLocaleDateString()} 
                    {' '}({new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </Text>
                </View>
            )}

            {task.category && (
                <View style={styles.metaRow}>
                <Icon name="folder-outline" size={20} color="#666" />
                <Text style={styles.metaText}>Category: {task.category}</Text>
                </View>
            )}
            </View>

            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>
            {task.description || 'No description provided.'}
            </Text>

        </ScrollView>

        {/* Action Buttons Footer */}
        <View style={styles.footer}>
            <TouchableOpacity 
            style={[styles.actionBtn, styles.editBtn]} 
            onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
            >
            <Icon name="create-outline" size={24} color="#007AFF" />
            <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]} 
            onPress={handleDelete}
            >
            <Icon name="trash-outline" size={24} color="#FF3B30" />
            <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={[styles.mainBtn, task.status === 'completed' ? styles.btnOutline : styles.btnFill]} 
            onPress={handleToggleStatus}
            >
            <Text style={[styles.mainBtnText, task.status === 'completed' && { color: '#007AFF' }]}>
                {task.status === 'completed' ? 'Mark Active' : 'Mark Complete'}
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    statusHeader: { flexDirection: 'row', marginBottom: 15 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 10 },
    bgSuccess: { backgroundColor: '#34C759' },
    bgActive: { backgroundColor: '#007AFF' },
    statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
    priorityText: { fontSize: 12, fontWeight: 'bold' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    metaContainer: { gap: 10, marginBottom: 20 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    metaText: { color: '#666', fontSize: 16 },
    textDanger: { color: '#FF3B30', fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    sectionLabel: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    description: { fontSize: 16, color: '#444', lineHeight: 24 },
    
    footer: { 
        flexDirection: 'row', 
        padding: 20, 
        borderTopWidth: 1, 
        borderTopColor: '#eee', 
        alignItems: 'center',
        gap: 15
    },
    actionBtn: { alignItems: 'center', padding: 10 },
    editBtn: {},
    editBtnText: { color: '#007AFF', fontSize: 12, marginTop: 4 },
    deleteBtn: {},
    deleteBtnText: { color: '#FF3B30', fontSize: 12, marginTop: 4 },
    mainBtn: { 
        flex: 1, 
        backgroundColor: '#007AFF', 
        padding: 15, 
        borderRadius: 12, 
        alignItems: 'center',
        marginLeft: 10
    },
    btnFill: { backgroundColor: '#007AFF' },
    btnOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF' },
    mainBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TaskDetailsScreen;