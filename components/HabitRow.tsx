import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    type: 'toggle' | 'counter' | 'slider'; // Simplified for now
    value: any;
    onChange: (val: any) => void;
    unit?: string;
}

export function HabitRow({ label, icon, type, value, onChange, unit }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.left}>
                <Ionicons name={icon} size={24} color={theme.text} style={styles.icon} />
                <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            </View>

            <View style={styles.right}>
                {type === 'toggle' && (
                    <Switch
                        value={!!value}
                        onValueChange={onChange}
                        trackColor={{ false: theme.border, true: theme.tint }}
                    />
                )}

                {type === 'counter' && (
                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => onChange(Math.max(0, (value || 0) - 1))}
                            style={[styles.btn, { borderColor: theme.border }]}
                        >
                            <Ionicons name="remove" size={20} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.value, { color: theme.text }]}>{value || 0} {unit}</Text>
                        <TouchableOpacity
                            onPress={() => onChange((value || 0) + 1)}
                            style={[styles.btn, { borderColor: theme.border }]}
                        >
                            <Ionicons name="add" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Simple numeric stepper for sleep too for now, or we can use a library later */}
                {type === 'slider' && (
                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => onChange(Math.max(0, (value || 0) - 0.5))}
                            style={[styles.btn, { borderColor: theme.border }]}
                        >
                            <Ionicons name="remove" size={20} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.value, { color: theme.text }]}>{value || 0} {unit}</Text>
                        <TouchableOpacity
                            onPress={() => onChange((value || 0) + 0.5)}
                            style={[styles.btn, { borderColor: theme.border }]}
                        >
                            <Ionicons name="add" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'center',
    }
});
