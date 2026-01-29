import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

const MOODS = [
    { value: 1, emoji: '😞', label: 'Rough' },
    { value: 2, emoji: '😐', label: 'Meh' },
    { value: 3, emoji: '🙂', label: 'Okay' },
    { value: 4, emoji: '😄', label: 'Good' },
    { value: 5, emoji: '🤩', label: 'Great' },
];

interface Props {
    value?: number;
    onSelect: (value: number) => void;
}

export function MoodPicker({ value, onSelect }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            {MOODS.map((mood) => {
                const isSelected = value === mood.value;
                return (
                    <TouchableOpacity
                        key={mood.value}
                        onPress={() => onSelect(mood.value)}
                        style={[
                            styles.item,
                            isSelected && { backgroundColor: theme.mood[mood.value as keyof typeof theme.mood] + '40', borderColor: theme.mood[mood.value as keyof typeof theme.mood] }, // 40 is alpha
                        ]}
                    >
                        <Text style={[styles.emoji, isSelected && { transform: [{ scale: 1.2 }] }]}>
                            {mood.emoji}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    item: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emoji: {
        fontSize: 32,
    },
});
