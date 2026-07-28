import React from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box, Chip } from '@mui/material';

/**
 * RestaurantOS Tabs Component
 * Segmented control tabs with sliding pill highlight indicator, icons, and badge counters.
 */
export const Tabs = ({
  value,
  onChange,
  tabs = [], // Array of { value, label, icon, badge }
  variant = 'pill', // 'pill' | 'underline'
  fullWidth = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        backgroundColor: variant === 'pill' ? 'var(--bg-subtle)' : 'transparent',
        p: variant === 'pill' ? 0.6 : 0,
        borderRadius: variant === 'pill' ? '14px' : 0,
        borderBottom: variant === 'underline' ? '1px solid var(--border-subdued)' : 'none',
        display: 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <MuiTabs
        value={value}
        onChange={onChange}
        variant={fullWidth ? 'fullWidth' : 'standard'}
        TabIndicatorProps={{
          style:
            variant === 'pill'
              ? { display: 'none' }
              : { backgroundColor: 'var(--primary-600)', height: 3, borderRadius: '3px' },
        }}
        sx={{
          minHeight: 38,
          width: fullWidth ? '100%' : 'auto',
          ...sx,
        }}
      >
        {tabs.map((tab) => {
          const isSelected = value === tab.value;
          return (
            <MuiTab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <Chip
                      label={tab.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--bg-surface)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    />
                  )}
                </Box>
              }
              sx={{
                minHeight: 38,
                borderRadius: variant === 'pill' ? '10px' : 0,
                textTransform: 'none',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '0.875rem',
                color: isSelected ? 'var(--primary-600)' : 'var(--text-secondary)',
                backgroundColor:
                  variant === 'pill' && isSelected ? 'var(--bg-surface)' : 'transparent',
                boxShadow:
                  variant === 'pill' && isSelected ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: 'var(--primary-500)',
                  backgroundColor:
                    variant === 'pill' && !isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                },
              }}
            />
          );
        })}
      </MuiTabs>
    </Box>
  );
};

export default Tabs;
