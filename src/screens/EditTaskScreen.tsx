// src/screens/EditTaskScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList, Priority } from '../types/ index';
import { RootState } from '../redux/store';
import { updateTask } from '../redux/slices/taskSlice';
import taskService from '../services/taskService';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

const EditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
    const { taskId } = route.params;
    const dispatch = useDispatch();
    
    // Get existing task data
    const task = useSelector((state: RootState) => 
        state.tasks.tasks.find(t => t.id === taskId)
    );

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [deadline, setDeadline] = useState<Date | undefined>();
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Load task data into state when component mounts
    useEffect(() => {
        if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setCategory(task.category || '');
        if (task.deadline) {
            setDeadline(new Date(task.deadline));
        }
        }
    }, [task]);

    const priorities: Array<{ value: Priority; label: string; color: string }> = [
        { value: 'high', label: 'High', color: '#FF3B30' },
        { value: 'medium', label: 'Medium', color: '#FF9500' },
        { value: 'low', label: 'Low', color: '#34C759' },
    ];

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
        setDeadline(selectedDate);
        }
    };

    const handleUpdate = async () => {
        if (!task) return;
        if (!title.trim()) {
        Alert.alert('Error', 'Title is required');
        return;
        }

        setLoading(true);
        try {
        const updates = {
            title: title.trim(),
            description: description.trim(),
            priority,
            deadline,
            category: category.trim(),
        };

        // 1. Update in Service (Backend/Mock)
        await taskService.updateTask(taskId, updates);
        
        // 2. Update in Redux Store (UI)
        dispatch(updateTask({ ...task, ...updates }));

        Alert.alert('Success', 'Task updated successfully');
        navigation.goBack();
        } catch (error: any) {
        Alert.alert('Error', error.message);
        } finally {
        setLoading(false);
        }
    };

    if (!task) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Title */}
        <View style={styles.group}>
            <Text style={styles.label}>Title</Text>
            <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task Title"
            />
        </View>

        {/* Description */}
        <View style={styles.group}>
            <Text style={styles.label}>Description</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description (Optional)"
            multiline
            textAlignVertical="top"
            />
        </View>

        {/* Priority */}
        <View style={styles.group}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
            {priorities.map((p) => (
                <TouchableOpacity
                key={p.value}
                style={[
                    styles.priorityBtn,
                    priority === p.value && { backgroundColor: p.color, borderColor: p.color }
                ]}
                onPress={() => setPriority(p.value)}
                >
                <Text style={[styles.priorityText, priority === p.value && styles.textWhite]}>
                    {p.label}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        {/* Deadline */}
        <View style={styles.group}>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>
                {deadline ? deadline.toLocaleDateString() + ' ' + deadline.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Set Deadline'}
            </Text>
            {deadline && (
                <TouchableOpacity onPress={() => setDeadline(undefined)}>
                <Icon name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
            </TouchableOpacity>
            
            {showDatePicker && (
            <DateTimePicker
                value={deadline || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
            />
            )}
        </View>

        {/* Category */}
        <View style={styles.group}>
            <Text style={styles.label}>Category</Text>
            <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Work, Personal"
            />
        </View>

        <TouchableOpacity 
            style={[styles.saveBtn, loading && styles.btnDisabled]} 
            onPress={handleUpdate}
            disabled={loading}
        >
            <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>

        </ScrollView>
    );
    };

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20 },
    group: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    textArea: { height: 100 },
    priorityRow: { flexDirection: 'row', gap: 10 },
    priorityBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
    priorityText: { color: '#333', fontWeight: '600' },
    textWhite: { color: '#fff' },
    dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    dateText: { flex: 1, marginLeft: 10, fontSize: 16 },
    saveBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    btnDisabled: { opacity: 0.7 },
    });

export default EditTaskScreen;