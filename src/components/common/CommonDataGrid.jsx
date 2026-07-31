import React, { useMemo } from 'react';
import { Paper, Tooltip, Typography, Skeleton, Box, useTheme, alpha, useMediaQuery } from '@mui/material';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Memoize column formatting to optimize grid render efficiency
  const formattedColumns = useMemo(() => {
    return columns.map((col) => {
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
  }, [columns]);

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1.5, borderRadius: '4px' }} />
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
          height: isMobile ? 320 : height,
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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

  // Render Mobile View Cards (< 900px)
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', mb: 3 }}>
        {rows.map((row, index) => {
          const id = getRowId ? getRowId(row) : (row.id || row._id || index);
          return (
            <Paper
              key={id}
              elevation={0}
              onClick={() => onRowClick && onRowClick({ row })}
              sx={{
                p: 2.5,
                borderRadius: '4px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'transform 0.15s ease, boxShadow 0.15s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,0,0,0.06)',
                },
              }}
            >
              {formattedColumns.map((col) => {
                if (col.field === 'id' || col.field === '_id') return null;

                const isActions = col.field === 'actions' || col.headerName?.toLowerCase().includes('action');
                const cellVal = col.renderCell
                  ? col.renderCell({
                      value: row[col.field],
                      row,
                      id,
                      api: {
                        getRowIndexRelativeToVisibleRows: () => index,
                        getAllRowIds: () => rows.map((r, i) => getRowId ? getRowId(r) : (r.id || r._id || i)),
                      },
                    })
                  : (row[col.field] != null && row[col.field] !== '' ? String(row[col.field]) : '—');

                if (isActions) {
                  return (
                    <Box
                      key={col.field}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 1.5,
                        mt: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.725rem' }}>
                        Actions
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {cellVal}
                      </Box>
                    </Box>
                  );
                }

                return (
                  <Box
                    key={col.field}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.8,
                      borderBottom: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.4),
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.02em', mr: 2 }}>
                      {col.headerName || col.field}
                    </Typography>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      {typeof cellVal === 'string' ? (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {cellVal}
                        </Typography>
                      ) : (
                        cellVal
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          );
        })}
      </Box>
    );
  }

  // Render Desktop & Laptop DataGrid (> 900px)
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: height,
        maxHeight: 'calc(100vh - 240px)',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.03)',
        ...sxOverride,
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
            px: 2.25,
            '&:focus, &:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            px: 2.25,
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
