import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

export const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no records to display.',
  icon: CustomIcon,
  onAction,
  actionLabel,
}) => {
  const IconComponent = CustomIcon || FolderOpenIcon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.50',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <IconComponent sx={{ fontSize: 36 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: onAction ? 3 : 0 }}>
        {description}
      </Typography>
      {onAction && actionLabel && (
        <Button variant="contained" onClick={onAction} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export const NoDataIllustration = EmptyState;

export default EmptyState;
