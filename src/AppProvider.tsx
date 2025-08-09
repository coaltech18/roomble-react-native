import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { darkTheme, lightTheme, AppTheme } from '@/theme/themes';
import { ThemeContext } from '@/theme/useTheme';

const InnerThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mode = useSelector((s: RootState) => s.settings.theme);
  const theme: AppTheme = mode === 'dark' ? darkTheme : lightTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}
      >
        <InnerThemeProvider>{children}</InnerThemeProvider>
      </PersistGate>
    </Provider>
  );
};


