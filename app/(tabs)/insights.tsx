import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getAllEntries, DailyEntry } from '../../db/database';
import { generateInsights, Insight } from '../../utils/insights';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InsightsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();
    const [insights, setInsights] = useState<Insight[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadInsights();
        }, [])
    );

    const loadInsights = async () => {
        const entries = await getAllEntries();
        const generated = generateInsights(entries);
        setInsights(generated);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        >
            <Text style={[styles.header, { color: theme.text }]}>Insights</Text>

            {insights.map((insight, index) => (
                <View
                    key={insight.id + index}
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderLeftWidth: 4,
                            borderLeftColor: insight.type === 'positive' ? '#4ECDC4' : insight.type === 'negative' ? '#FF6B6B' : theme.icon
                        }
                    ]}
                >
                    <Text style={[styles.cardText, { color: theme.text }]}>
                        {insight.text}
                    </Text>
                </View>
            ))}

            {insights.length === 0 && (
                <Text style={{ color: theme.icon, textAlign: 'center', marginTop: 50 }}>
                    Not enough data yet.
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
    card: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
        // borderLeftWidth handled inline for color
    },
    cardText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '500',
    }
});
