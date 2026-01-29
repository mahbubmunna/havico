import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const getDBConnection = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('mood_habit.db');
    }
    return db;
};

export const initDatabase = async () => {
    const database = await getDBConnection();

    // Create table if not exists
    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS daily_entries (
      date TEXT PRIMARY KEY NOT NULL,
      mood_score INTEGER,
      note TEXT,
      sleep_hours REAL,
      caffeine_cups INTEGER,
      workout INTEGER,
      steps INTEGER
    );
  `);

    console.log('Database initialized');
};

export type DailyEntry = {
    date: string;
    mood_score?: number;
    note?: string;
    sleep_hours?: number;
    caffeine_cups?: number;
    workout?: number; // 0 or 1
    steps?: number;
};

export const saveEntry = async (entry: DailyEntry) => {
    const database = await getDBConnection();
    const { date, mood_score, note, sleep_hours, caffeine_cups, workout, steps } = entry;

    // Upsert
    await database.runAsync(`
    INSERT OR REPLACE INTO daily_entries (date, mood_score, note, sleep_hours, caffeine_cups, workout, steps)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `, [date, mood_score ?? null, note ?? null, sleep_hours ?? null, caffeine_cups ?? null, workout ?? 0, steps ?? null]);
};

export const getEntry = async (date: string): Promise<DailyEntry | null> => {
    const database = await getDBConnection();
    const result = await database.getFirstAsync<DailyEntry>(`
    SELECT * FROM daily_entries WHERE date = ?;
  `, [date]);
    return result;
};

export const getAllEntries = async (): Promise<DailyEntry[]> => {
    const database = await getDBConnection();
    return await database.getAllAsync<DailyEntry>(`
    SELECT * FROM daily_entries ORDER BY date DESC;
  `);
};
