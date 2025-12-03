// src/components/FilterBar.tsx

import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSortBy } from '../redux/slices/taskSlice';
import { RootState } from '../redux/store';
import { Priority, TaskStatus } from '../types/ index';

const FilterBar: React.FC = () => {
    const dispatch = useDispatch();
    const { filter, sortBy } = useSelector((state: RootState) => state.tasks);

    /**
     * Status filter options
     */
    const statusOptions: Array<{ value: 'all' | TaskStatus; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
    ];

    /**
     * Priority filter options
     */
    const priorityOptions: Array<{ value: Priority | undefined; label: string }> = [
        { value: undefined, label: 'All' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    /**
     * Sort options
     */
    const sortOptions: Array<{
        value: 'smart' | 'deadline' | 'priority' | 'created';
        label: string;
        icon: string;
    }> = [
        { value: 'smart', label: 'Smart', icon: 'flash' },
        { value: 'deadline', label: 'Deadline', icon: 'calendar' },
        { value: 'priority', label: 'Priority', icon: 'flag' },
        { value: 'created', label: 'Recent', icon: 'time' },
    ];

    return (
        <View style={styles.container}>
        {/* Status Filter */}
        <View style={styles.section}>
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {statusOptions.map((option) => (
                <TouchableOpacity
                key={option.value}
                style={[
                    styles.filterButton,
                    filter.status === option.value && styles.filterButtonActive,
                ]}
                onPress={() => dispatch(setFilter({ status: option.value }))}>
                <Text
                    style={[
                    styles.filterText,
                    filter.status === option.value && styles.filterTextActive,
                    ]}>
                    {option.label}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>

        {/* Priority & Sort Row */}
        <View style={styles.row}>
            {/* Priority Filter */}
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.flex}>
            {priorityOptions.map((option, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.chipButton,
                    filter.priority === option.value && styles.chipButtonActive,
                ]}
                onPress={() => dispatch(setFilter({ priority: option.value }))}>
                <Icon
                    name="flag"
                    size={12}
                    color={
                    filter.priority === option.value ? '#fff' : '#666'
                    }
                />
                <Text
                    style={[
                    styles.chipText,
                    filter.priority === option.value && styles.chipTextActive,
                    ]}>
                    {option.label}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>

            {/* Sort Options */}
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.flex}>
            {sortOptions.map((option) => (
                <TouchableOpacity
                key={option.value}
                style={[
                    styles.chipButton,
                    sortBy === option.value && styles.chipButtonActive,
                ]}
                onPress={() => dispatch(setSortBy(option.value))}>
                <Icon
                    name={option.icon}
                    size={12}
                    color={sortBy === option.value ? '#fff' : '#666'}
                />
                <Text
                    style={[
                    styles.chipText,
                    sortBy === option.value && styles.chipTextActive,
                    ]}>
                    {option.label}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 12,
    },
    section: {
        marginBottom: 8,
    },
    filterRow: {
        paddingHorizontal: 16,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    filterTextActive: {
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    flex: {
        flex: 1,
    },
    chipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    chipButtonActive: {
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
        marginLeft: 4,
    },
    chipTextActive: {
        color: '#fff',
    },
});

export default FilterBar;