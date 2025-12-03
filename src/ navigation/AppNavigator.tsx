// src/navigation/AppNavigator.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import authService from '../services/authService';
import { RootStackParamList } from '../types/ index';

// Screens
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    /**
     * Check for existing auth session on mount
     */
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
        dispatch(setUser(currentUser));
        }
    }, []);

    return (
        <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            }}>
            {!user ? (
            // Auth Stack
            <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </>
            ) : (
            // Main App Stack
            <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={{
                    headerShown: true,
                    title: 'Task Details',
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#007AFF',
                }}
                />
                <Stack.Screen
                name="AddTask"
                component={AddTaskScreen}
                options={{
                    headerShown: true,
                    title: 'New Task',
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#007AFF',
                }}
                />
                <Stack.Screen
                name="EditTask"
                component={EditTaskScreen}
                options={{
                    headerShown: true,
                    title: 'Edit Task',
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#007AFF',
                }}
                />
            </>
            )}
        </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;