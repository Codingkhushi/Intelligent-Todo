// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList, Task } from '../types/ index';
import { RootState } from '../redux/store';
import { setTasks, setLoading } from '../redux/slices/taskSlice';
import { logout } from '../redux/slices/authSlice';
import authService from '../services/authService';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import { sortTasks } from '../utils/sortingAlgorithm';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { tasks, loading, filter, sortBy } = useSelector(
        (state: RootState) => state.tasks
    );

    /**
     * Load tasks on component mount
     */
    useEffect(() => {
        if (user) {
        loadTasks();
        // Subscribe to real-time updates
        const unsubscribe = taskService.subscribeToTasks(
            user.id,
            (updatedTasks) => {
            dispatch(setTasks(updatedTasks));
            },
            (error) => {
            Alert.alert('Error', error.message);
            }
        );

        return () => unsubscribe();
        }
    }, [user]);

    /**
     * Load tasks from Firestore
     */
    const loadTasks = async () => {
        if (!user) return;

        dispatch(setLoading(true));
        try {
        const userTasks = await taskService.getUserTasks(user.id);
        dispatch(setTasks(userTasks));
        } catch (error: any) {
        Alert.alert('Error', error.message);
        }
    };

    /**
     * Handle logout
     */
    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
            await authService.logout();
            dispatch(logout());
            },
        },
        ]);
    };

    /**
     * Filter and sort tasks
     */
    const getFilteredTasks = (): Task[] => {
        let filtered = tasks;

        // Filter by status
        if (filter.status !== 'all') {
        filtered = filtered.filter((task) => task.status === filter.status);
        }

        // Filter by priority
        if (filter.priority) {
        filtered = filtered.filter((task) => task.priority === filter.priority);
        }

        // Filter by category
        if (filter.category) {
        filtered = filtered.filter((task) => task.category === filter.category);
        }

        // Apply sorting
        return sortTasks(filtered, sortBy);
    };

    const filteredTasks = getFilteredTasks();

    /**
     * Render empty state
     */
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
        <Icon name="checkbox-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptyText}>
            Tap the + button to create your first task
        </Text>
        </View>
    );

    return (
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.email}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>

        {/* Filter Bar */}
        <FilterBar />

        {/* Task List */}
        {loading ? (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            </View>
        ) : (
            <FlatList
            data={filteredTasks}
            renderItem={({ item }) => (
                <TaskCard task={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            />
        )}

        {/* Add Task Button */}
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AddTask')}>
            <Icon name="add" size={32} color="#fff" />
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    logoutButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default HomeScreen;