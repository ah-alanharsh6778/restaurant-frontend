import React, { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';

/**
 * RestaurantOS Dropdown Component
 * Action popover menu supporting icons, item dividers, danger highlights, badges, and glass styling.
 */
export const Dropdown = ({
  trigger,
  items = [], // Array of { label, icon, onClick, danger, divider, badge }
  align = 'right', // 'left' | 'right'
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (itemAction) => {
    handleClose();
    if (itemAction) itemAction();
  };

  return (
    <>
      <Box onClick={handleClick} sx={{ display: 'inline-block', cursor: 'pointer' }}>
        {trigger}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 200,
            borderRadius: '16px',
            mt: 1,
            p: 0.8,
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid var(--border-subdued)',
            boxShadow: 'var(--shadow-lg)',
            ...sx,
          },
        }}
        transformOrigin={{
          horizontal: align === 'right' ? 'right' : 'left',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: align === 'right' ? 'right' : 'left',
          vertical: 'bottom',
        }}
      >
        {items.map((item, idx) => {
          if (item.divider) {
            return <Divider key={`divider-${idx}`} sx={{ my: 0.8, borderColor: 'var(--border-subdued)' }} />;
          }

          return (
            <MenuItem
              key={item.label || idx}
              onClick={() => handleItemClick(item.onClick)}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: '10px',
                color: item.danger ? 'var(--color-danger)' : 'var(--text-primary)',
                '&:hover': {
                  backgroundColor: item.danger ? 'var(--color-danger-bg)' : 'var(--bg-subtle)',
                },
              }}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: item.danger ? 'var(--color-danger)' : 'var(--text-secondary)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  },
                }}
              />
              {item.badge && (
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 700, ml: 1 }}>
                  {item.badge}
                </Typography>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default Dropdown;
