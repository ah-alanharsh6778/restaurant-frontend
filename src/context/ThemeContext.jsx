import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../styles/theme';
import { designTokens } from '../styles/designTokens';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  setMode: (mode) => {},
  mode: 'light',
  designTokens,
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    const savedMode = localStorage.getItem('app_theme_mode');
    return savedMode === 'dark' || savedMode === 'light' ? savedMode : 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setModeState((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      setMode: (newMode) => {
        if (newMode === 'light' || newMode === 'dark') {
          setModeState(newMode);
        }
      },
      mode,
      designTokens,
    }),
    [mode]
  );

  const muiTheme = useMemo(() => {
    return createAppTheme(mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeContextProvider;
