import React from 'react';
import { Paper, Tooltip, Typography, Skeleton, Box, useTheme, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TableChartIcon from '@mui/icons-material/TableChart';

export const CommonDataGrid = ({
  rows = [],
  columns = [],
  loading = false,
  getRowId,
  height = 560,
  rowHeight = 64,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  emptyComponent,
  emptyMessage = 'No telemetry records found',
  density = 'standard',
  onRowClick,
  sx: sxOverride = {},
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1.5, borderRadius: 2 }} />
        ))}
      </Paper>
    );
  }

  // Built-in Empty State fallback if emptyComponent is not passed
  if (!rows || rows.length === 0) {
    if (emptyComponent) return emptyComponent;
    return (
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          height: height,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          gap: 1.5,
          p: 4,
          bgcolor: 'background.paper',
        }}
      >
        <TableChartIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.6 }} />
        <Typography variant="h6" fontWeight={700} color="text.secondary">
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.disabled" align="center">
          There are currently no records to display for this view.
        </Typography>
      </Paper>
    );
  }

  // Auto-enhance columns with object-safe string renderer & automatic tooltips for overflow
  const formattedColumns = columns.map((col) => {
    if (!col.renderCell && !col.type) {
      return {
        ...col,
        renderCell: (params) => {
          let rawVal = params.value;
          if (rawVal !== null && typeof rawVal === 'object') {
            rawVal = rawVal.name || rawVal.fullName || rawVal.email || rawVal.title || rawVal.id || '';
          }
          const strVal = rawVal != null ? String(rawVal) : '';

          return (
            <Tooltip title={strVal} placement="top-start" arrow disableHoverListener={!strVal || strVal.length < 25}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  width: '100%',
                  fontWeight: col.fontWeight || 500,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '0.875rem',
                  lineHeight: 1.3,
                }}
              >
                {strVal || '—'}
              </Typography>
            </Tooltip>
          );
        },
      };
    }
    return col;
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: height,
        maxHeight: 'calc(100vh - 240px)',
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <DataGrid
        rows={rows}
        columns={formattedColumns}
        getRowId={getRowId || ((row) => row.id || row._id)}
        initialState={{
          pagination: { paginationModel: { pageSize: pageSize } },
        }}
        pageSizeOptions={pageSizeOptions}
        density={density}
        rowHeight={rowHeight}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        sx={{
          border: 'none',
          fontFamily: theme.typography.fontFamily,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.04) : alpha(theme.palette.common.black, 0.02),
            fontWeight: 800,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            color: 'text.secondary',
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-columnHeader': {
            px: 2.25, // 18px horizontal padding for headers
            '&:focus, &:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            px: 2.25, // 18px horizontal padding for cells (no clipping!)
            borderBottom: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
            '&:focus, &:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-row': {
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'background-color 0.15s ease',
            '&:nth-of-type(even)': {
              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.015) : alpha(theme.palette.common.black, 0.012),
            },
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.04),
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.02) : alpha(theme.palette.common.black, 0.01),
          },
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'auto',
          },
        }}
      />
    </Paper>
  );
};

export default CommonDataGrid;
