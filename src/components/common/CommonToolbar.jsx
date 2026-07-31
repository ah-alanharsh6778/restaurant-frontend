import React from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const CommonToolbar = ({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = null,
  actions = null,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: '4px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left & Center: Search + Filters */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ flexGrow: 1, flexWrap: 'wrap', alignItems: 'center' }}
        >
          {onSearchChange !== undefined && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: { xs: '100%', sm: 260 },
                bgcolor: 'background.paper',
                borderRadius: '4px',
              }}
            />
          )}

          {filters}
        </Stack>

        {/* Right: Actions */}
        {actions && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: { xs: '100%', lg: 'auto' },
              justifyContent: { xs: 'flex-start', lg: 'flex-end' },
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {actions}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default CommonToolbar;
