import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAllEntries } from '../../db/database';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();

    const exportData = async () => {
        const entries = await getAllEntries();
        const header = Object.keys(entries[0] || {}).join(',');
        const rows = entries.map(e => Object.values(e).join(','));
        const csv = [header, ...rows].join('\n');

        // In a real app we'd write to file and share/share intent. 
        // Simplified for now: Log or potentially Share.share({ message: csv })
        Share.share({
            message: csv,
            title: 'Mood Data Export.csv'
        });
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        >
            <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

            <View style={[styles.section, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Data</Text>
                <TouchableOpacity onPress={exportData}>
                    <Text style={[styles.link, { color: theme.tint }]}>Export Data (CSV)</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={{ color: theme.icon, textAlign: 'center' }}>Version 1.0.0</Text>
            </View>
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
    section: {
        borderBottomWidth: 1,
        paddingBottom: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    link: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: 40,
    }
});
