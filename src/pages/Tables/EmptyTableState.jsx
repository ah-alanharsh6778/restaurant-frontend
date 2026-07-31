import React from 'react';
import { Paper, Typography, Button, Avatar } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import AddIcon from '@mui/icons-material/Add';

export const EmptyTableState = ({ onAddTable, searchOrFilterActive = false, canManage = true }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        borderRadius: '20px',
        backgroundColor: '#131A24',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
      }}
    >
      <Avatar
        sx={{
          width: 64,
          height: 64,
          bgcolor: 'rgba(124, 108, 255, 0.12)',
          color: '#7C6CFF',
          mb: 2.5,
          border: '1px solid rgba(124, 108, 255, 0.3)',
        }}
      >
        <TableBarIcon sx={{ fontSize: 32 }} />
      </Avatar>

      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#FFFFFF', fontSize: '20px' }}>
        {searchOrFilterActive ? 'No Matching Tables Found' : 'No Tables Available'}
      </Typography>

      <Typography variant="body2" sx={{ color: '#9CA3AF', maxWidth: 440, mb: 3.5, fontSize: '15px' }}>
        {searchOrFilterActive
          ? 'No tables match your current search query or filter criteria. Try clearing filters or searching for another table number.'
          : 'Get started by creating your first restaurant table to manage capacity, status, and floor layouts.'}
      </Typography>

      {onAddTable && canManage && !searchOrFilterActive && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddTable}
          sx={{
            borderRadius: '14px',
            px: 3.5,
            py: 1.2,
            fontWeight: 700,
            backgroundColor: '#7C6CFF',
            color: '#FFFFFF',
            textTransform: 'none',
            boxShadow: '0 8px 20px rgba(124, 108, 255, 0.35)',
            '&:hover': {
              backgroundColor: '#6854FF',
              boxShadow: '0 12px 28px rgba(124, 108, 255, 0.5)',
            },
          }}
        >
          Add New Table
        </Button>
      )}
    </Paper>
  );
};

export default EmptyTableState;
