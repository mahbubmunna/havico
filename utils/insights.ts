import { DailyEntry } from '../db/database';

export type Insight = {
    id: string;
    text: string;
    type: 'positive' | 'negative' | 'neutral';
    score: number; // For sorting relevance
};

export function generateInsights(entries: DailyEntry[]): Insight[] {
    if (entries.length < 5) {
        return [{
            id: 'not_enough_data',
            text: "Keep logging for a few more days to see patterns!",
            type: 'neutral',
            score: 0
        }];
    }

    const ins: Insight[] = [];

    // Clean data: only entries with mood
    const validEntries = entries.filter(e => e.mood_score !== null && e.mood_score !== undefined);
    if (validEntries.length < 5) return ins;

    const totalMood = validEntries.reduce((sum, e) => sum + (e.mood_score || 0), 0);
    const avgMood = totalMood / validEntries.length;

    // 1. Sleep Analysis
    const highSleep = validEntries.filter(e => (e.sleep_hours || 0) >= 7.5);
    const lowSleep = validEntries.filter(e => (e.sleep_hours || 0) < 6 && (e.sleep_hours || 0) > 0);

    if (highSleep.length >= 3) {
        const avgHigh = highSleep.reduce((s, e) => s + (e.mood_score || 0), 0) / highSleep.length;
        const diff = avgHigh - avgMood;
        if (diff > 0.3) {
            ins.push({
                id: 'sleep_good',
                text: `Your mood is ${(diff * 20).toFixed(0)}% better when you sleep 7.5+ hours.`,
                type: 'positive',
                score: diff
            });
        }
    }

    if (lowSleep.length >= 3) {
        const avgLow = lowSleep.reduce((s, e) => s + (e.mood_score || 0), 0) / lowSleep.length;
        const diff = avgMood - avgLow;
        if (diff > 0.3) {
            ins.push({
                id: 'sleep_bad',
                text: `Short sleep (<6h) tends to lower your mood by around ${(diff * 20).toFixed(0)}%.`,
                type: 'negative',
                score: diff
            });
        }
    }

    // 2. Caffeine Analysis
    const highCaffeine = validEntries.filter(e => (e.caffeine_cups || 0) >= 3);
    if (highCaffeine.length >= 3) {
        const avgCaff = highCaffeine.reduce((s, e) => s + (e.mood_score || 0), 0) / highCaffeine.length;
        const diff = avgMood - avgCaff;

        if (diff > 0.3) {
            ins.push({
                id: 'caffeine_high',
                text: `Days with 3+ coffees coincide with lower mood.`,
                type: 'negative',
                score: diff
            });
        } else if (avgCaff - avgMood > 0.3) {
            ins.push({
                id: 'caffeine_boost',
                text: `You seem happier on high caffeine days!`,
                type: 'positive',
                score: avgCaff - avgMood
            });
        }
    }

    // 3. Workout Analysis
    const workoutDays = validEntries.filter(e => !!e.workout);
    const noWorkoutDays = validEntries.filter(e => !e.workout);

    if (workoutDays.length >= 3 && noWorkoutDays.length >= 3) {
        const avgWorkout = workoutDays.reduce((s, e) => s + (e.mood_score || 0), 0) / workoutDays.length;
        const avgNoWorkout = noWorkoutDays.reduce((s, e) => s + (e.mood_score || 0), 0) / noWorkoutDays.length;

        const diff = avgWorkout - avgNoWorkout;
        if (diff > 0.3) {
            ins.push({
                id: 'workout_benefit',
                text: `Moving your body lifts your mood significantly (+${diff.toFixed(1)} points).`,
                type: 'positive',
                score: diff
            });
        }
    }

    return ins.sort((a, b) => b.score - a.score);
}
