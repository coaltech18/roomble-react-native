export const colors = {
  primary: '#2DD4BF',
  navy: '#1E293B',
  coral: '#FB7185',
  background: '#FEFEFE',
  surface: '#F1F5F9',
  textSecondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.navy
  },
  body: {
    fontSize: 16,
    color: colors.navy
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary
  }
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  }
};

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
};

export const theme: Theme = { colors, spacing, typography, shadows };


