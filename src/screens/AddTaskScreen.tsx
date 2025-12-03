// src/screens/AddTaskScreen.tsx

import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../redux/slices/taskSlice';
import { RootState } from '../redux/store';
import taskService from '../services/taskService';
import { Priority, RootStackParamList, Task } from '../types/ index';

type AddTaskScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTask'>;
};

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  
  // Date Picker States
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date'); // <--- FIX FOR ANDROID

  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const priorities: Array<{ value: Priority; label: string; color: string }> = [
    { value: 'high', label: 'High', color: '#FF3B30' },
    { value: 'medium', label: 'Medium', color: '#FF9500' },
    { value: 'low', label: 'Low', color: '#34C759' },
  ];

  /**
   * Handle Date Change
   * On Android: Pick Date -> Close -> Open Time -> Close -> Save
   */
  const onDateChange = (event: any, selectedDate?: Date) => {
    // If user cancelled, just close
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      if (Platform.OS === 'android') {
        setShowDatePicker(false); // Close the picker first
        
        if (mode === 'date') {
          // We just picked the Date, now let's save it temporarily and open Time picker
          const current = deadline || new Date();
          const newDate = new Date(selectedDate);
          // Keep current time, update year/month/day
          newDate.setHours(current.getHours());
          newDate.setMinutes(current.getMinutes());
          setDeadline(newDate);
          
          // Switch to Time mode and open again
          setMode('time');
          setTimeout(() => setShowDatePicker(true), 100); 
        } else {
          // We just picked the Time
          const current = deadline || new Date();
          const newTime = new Date(selectedDate);
          // Keep current date, update hours/minutes
          current.setHours(newTime.getHours());
          current.setMinutes(newTime.getMinutes());
          setDeadline(new Date(current)); // Force re-render
          setMode('date'); // Reset mode for next time
        }
      } else {
        // iOS Logic (Simple)
        setDeadline(selectedDate);
      }
    }
  };

  const openPicker = () => {
    setMode('date'); // Always start with Date
    setShowDatePicker(true);
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const newTask: Omit<Task, 'id'> = {
        userId: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        deadline,
        category: category.trim() || undefined,
        status: 'active',
        createdAt: new Date(),
      };

      const createdTask = await taskService.createTask(newTask);
      dispatch(addTask(createdTask));

      Alert.alert('Success', 'Task created successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter task description (optional)"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityButton,
                priority === p.value && {
                  backgroundColor: p.color,
                  borderColor: p.color,
                },
              ]}
              onPress={() => setPriority(p.value)}>
              <Icon
                name="flag"
                size={16}
                color={priority === p.value ? '#fff' : p.color}
              />
              <Text
                style={[
                  styles.priorityText,
                  priority === p.value && styles.priorityTextActive,
                ]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Deadline (Optional)</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={openPicker}>
          <Icon name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.dateText}>
            {deadline
              ? deadline.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Set deadline'}
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
            mode={Platform.OS === 'ios' ? 'datetime' : mode} // <--- DYNAMIC MODE
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Work, Personal, Shopping"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <TouchableOpacity
        style={[styles.createButton, loading && styles.buttonDisabled]}
        onPress={handleCreateTask}
        disabled={loading}>
        <Icon name="checkmark" size={24} color="#fff" />
        <Text style={styles.createButtonText}>
          {loading ? 'Creating...' : 'Create Task'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  priorityTextActive: {
    color: '#fff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AddTaskScreen;