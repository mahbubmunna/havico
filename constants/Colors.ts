const tintColorLight = '#6C63FF';
const tintColorDark = '#8B85FF';

export const Colors = {
    light: {
        text: '#1A1A1A',
        background: '#FAFAFA',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        card: '#FFFFFF',
        border: '#E5E5E5',
        mood: {
            1: '#FF6B6B', // Sad
            2: '#FFD93D', // Neutral/Bad
            3: '#A8DADC', // Okay
            4: '#4ECDC4', // Good
            5: '#95E1D3', // Great (Star)
        }
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        card: '#1E1E1E',
        border: '#2C2C2C',
        mood: {
            1: '#D64545',
            2: '#C9B030',
            3: '#7CA9AB',
            4: '#32A098',
            5: '#6BB3A7',
        }
    },
};
