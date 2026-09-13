export const lightColors = {
  primary: '#C65D4B',
  primaryLight: '#E8A598',
  secondary: '#7A9E7E',
  background: '#FAF7F2',
  white: '#FFFFFF',
  text: '#252525',
  mutedText: '#77736D',
  accent: '#D9A441',
  border: '#E8E2DA',
  cardBg: '#FFFFFF',
  inputBg: '#F2ECE4',
  danger: '#D9534F',
};

export const darkColors = {
  primary: '#E07060',
  primaryLight: '#B05040',
  secondary: '#7A9E7E',
  background: '#0F0F0F',
  white: '#FFFFFF',
  text: '#F5F5F5',
  mutedText: '#9A9A9A',
  accent: '#D9A441',
  border: '#3A3A3C',
  cardBg: '#1C1C1E',
  inputBg: '#2C2C2E',
  danger: '#FF6B6B',
};

export type AppColors = typeof lightColors;
export type ThemeColors = AppColors;

export default lightColors;
