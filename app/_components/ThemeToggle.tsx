'use client';

import { useTheme } from '../../utils/theme/themeContext';
import { IconButton, Switch, Typography, Stack, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 0.5,
        boxShadow: 1,
      }}
    >
      <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton
          onClick={toggleTheme}
          color="primary"
          size="small"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="text.secondary">
        {theme === 'light' ? 'Dark' : 'Light'}
      </Typography>

      <Switch
        size="small"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        inputProps={{ 'aria-label': 'theme toggle' }}
      />
    </Stack>
  );
}
