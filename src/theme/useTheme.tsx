import React from 'react';
import { AppTheme, lightTheme } from './themes';

export const ThemeContext = React.createContext<AppTheme>(lightTheme);
export const useTheme = () => React.useContext(ThemeContext);


