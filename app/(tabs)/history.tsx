import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getAllEntries, DailyEntry } from '../../db/database';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();
    const [entries, setEntries] = useState<DailyEntry[]>([]);

    const loadData = async () => {
        const data = await getAllEntries();
        setEntries(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // Group by month (YYYY-MM)
    const grouped = entries.reduce((acc, entry) => {
        const month = entry.date.substring(0, 7);
        if (!acc[month]) acc[month] = [];
        acc[month].push(entry);
        return acc;
    }, {} as Record<string, DailyEntry[]>);

    const months = Object.keys(grouped).sort().reverse();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        >
            <Text style={[styles.header, { color: theme.text }]}>History</Text>

            {months.map(month => (
                <View key={month} style={styles.monthContainer}>
                    <Text style={[styles.monthTitle, { color: theme.text }]}>
                        {new Date(month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </Text>
                    <View style={styles.grid}>
                        {grouped[month].map(entry => (
                            <View key={entry.date} style={styles.dayCell}>
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor: entry.mood_score
                                                ? theme.mood[entry.mood_score as keyof typeof theme.mood]
                                                : theme.border
                                        }
                                    ]}
                                />
                                <Text style={[styles.dayText, { color: theme.icon }]}>
                                    {entry.date.substring(8)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            {months.length === 0 && (
                <Text style={{ color: theme.icon, textAlign: 'center', marginTop: 50 }}>
                    No entries yet. Start logging!
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 30,
    },
    monthContainer: {
        marginBottom: 30,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    dayCell: {
        width: '14.28%', // 7 days roughly
        alignItems: 'center',
        marginBottom: 12,
    },
    dot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginBottom: 4,
    },
    dayText: {
        fontSize: 10,
    }
});
