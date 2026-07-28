import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
      <IconButton color="inherit" onClick={toggleTheme}>
        {mode === 'dark' ? <LightModeIcon sx={{ color: '#FBBF24' }} /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
