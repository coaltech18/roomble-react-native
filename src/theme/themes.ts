export type AppTheme = {
  colors: {
    primary: string;
    navy: string;
    coral: string;
    background: string;
    surface: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  typography: {
    heading: { fontSize: number; fontWeight: '700'; color: string };
    body: { fontSize: number; color: string };
    caption: { fontSize: number; color: string };
  };
  shadows: { card: any };
};

const base = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3
    }
  }
};

export const lightTheme: AppTheme = {
  colors: {
    primary: '#2DD4BF',
    navy: '#1E293B',
    coral: '#FB7185',
    background: '#FEFEFE',
    surface: '#F1F5F9',
    textSecondary: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  spacing: base.spacing,
  typography: {
    heading: { fontSize: 24, fontWeight: '700', color: '#1E293B' },
    body: { fontSize: 16, color: '#1E293B' },
    caption: { fontSize: 12, color: '#64748B' }
  },
  shadows: base.shadows
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#2DD4BF',
    navy: '#E2E8F0',
    coral: '#FB7185',
    background: '#0B1220',
    surface: '#111827',
    textSecondary: '#94A3B8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  spacing: base.spacing,
  typography: {
    heading: { fontSize: 24, fontWeight: '700', color: '#E2E8F0' },
    body: { fontSize: 16, color: '#E2E8F0' },
    caption: { fontSize: 12, color: '#94A3B8' }
  },
  shadows: base.shadows
};


