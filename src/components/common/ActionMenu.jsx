import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const ActionMenu = ({ actions = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleActionClick = (event, actionOnClick) => {
    event.stopPropagation();
    handleCloseMenu(event);
    if (actionOnClick) actionOnClick(event);
  };

  if (!actions || actions.length === 0) return null;

  // On Mobile: Render single MoreVertIcon with dropdown Menu
  if (isMobile) {
    return (
      <Box onClick={(e) => e.stopPropagation()}>
        <IconButton
          size="small"
          onClick={handleOpenMenu}
          aria-label="actions menu"
          sx={{ width: 34, height: 34 }}
        >
          <MoreVertIcon fontSize="small" color="action" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                borderRadius: 2.5,
                minWidth: 150,
                py: 0.5,
              },
            },
          }}
        >
          {actions.map((act, index) => (
            <MenuItem
              key={index}
              onClick={(e) => handleActionClick(e, act.onClick)}
              sx={{
                py: 1,
                px: 2,
                color: act.color === 'error' ? 'error.main' : 'text.primary',
              }}
            >
              {act.icon && (
                <ListItemIcon sx={{ color: act.color === 'error' ? 'error.main' : act.color ? `${act.color}.main` : 'text.secondary', minWidth: 32 }}>
                  {act.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={act.label}
                slotProps={{
                  primary: {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  },
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // On Desktop / Laptop: Inline IconButtons (or compact Button if explicitly set)
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((act, index) => {
        if (act.variant === 'button') {
          return (
            <Button
              key={index}
              size="small"
              variant={act.buttonVariant || 'contained'}
              color={act.color || 'primary'}
              startIcon={act.icon}
              onClick={(e) => handleActionClick(e, act.onClick)}
              sx={{
                px: 1.2,
                py: 0.3,
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 1.5,
                textTransform: 'none',
                minWidth: 0,
                boxShadow: 'none',
              }}
            >
              {act.label}
            </Button>
          );
        }

        return (
          <Tooltip key={index} title={act.label} placement="top" arrow>
            <IconButton
              size="small"
              color={act.color || 'default'}
              onClick={(e) => handleActionClick(e, act.onClick)}
              aria-label={act.label}
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: act.color ? `${act.color}.50` : 'action.hover',
                },
              }}
            >
              {act.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default ActionMenu;
