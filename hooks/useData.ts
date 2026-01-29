import { useState, useCallback } from 'react';
import { getAllEntries, getEntry, saveEntry, DailyEntry } from '../db/database';
import { useFocusEffect } from 'expo-router';

export function useDailyEntry(date: string) {
    const [entry, setEntry] = useState<DailyEntry | null>(null);
    const [loading, setLoading] = useState(true);

    const loadEntry = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEntry(date);
            if (data) {
                setEntry(data);
            } else {
                // Init empty
                setEntry({ date });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useFocusEffect(
        useCallback(() => {
            loadEntry();
        }, [loadEntry])
    );

    const updateEntry = async (updates: Partial<DailyEntry>) => {
        if (!entry) return;
        const newEntry = { ...entry, ...updates };
        setEntry(newEntry);
        await saveEntry(newEntry);
    };

    return { entry, loading, updateEntry, refresh: loadEntry };
}
