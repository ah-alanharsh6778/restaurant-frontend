import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * RestaurantOS — Unified Enterprise Table Component
 * Fulfills all UI requirements:
 * - Sticky header with uppercase typography
 * - 18px (px: 2.25) cell padding to prevent text clipping & border touch
 * - Alternating row backgrounds & smooth hover effects
 * - Automatic text truncation with hover tooltips
 * - Perfectly vertically centered avatars, names, and emails
 * - Clean pagination & responsive horizontal overflow
 */
export const Table = ({
  columns = [], // Array of { id, label, minWidth, flex, align, render }
  rows = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  totalCount,
  emptyMessage = 'No records found in database',
  sx = {},
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          ...sx,
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={56} sx={{ mb: 1.5, borderRadius: 2 }} />
        ))}
      </Paper>
    );
  }

  // Calculate slice range for non-server paginated rows
  const displayRows =
    totalCount !== undefined
      ? rows
      : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.03)',
        ...sx,
      }}
    >
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)', minHeight: 320 }}>
        <MuiTable stickyHeader aria-label="enterprise data table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  style={{ minWidth: col.minWidth }}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.025),
                    color: 'text.secondary',
                    fontWeight: 800,
                    fontSize: '0.78125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    px: 2.25, // 18px padding
                    py: 1.75,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayRows.map((row, index) => (
                <TableRow
                  hover
                  key={row.id || row._id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    height: 64, // Consistent row height
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                    '&:nth-of-type(even)': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.015) : alpha(theme.palette.common.black, 0.012),
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.04),
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((col) => {
                    const rawVal = row[col.id];
                    let content = null;

                    if (col.render) {
                      content = col.render(row, rawVal, index);
                    } else {
                      const strVal = rawVal != null ? String(rawVal) : '—';
                      content = (
                        <Tooltip title={strVal} placement="top-start" arrow disableHoverListener={strVal.length < 25}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.3,
                            }}
                          >
                            {strVal}
                          </Typography>
                        </Tooltip>
                      );
                    }

                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{
                          px: 2.25, // 18px cell padding (no clipping!)
                          py: 1,
                          borderColor: alpha(theme.palette.divider, 0.8),
                          fontSize: '0.875rem',
                          color: 'text.primary',
                          verticalAlign: 'middle',
                        }}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount !== undefined ? totalCount : rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.02) : alpha(theme.palette.common.black, 0.01),
          }}
        />
      )}
    </Paper>
  );
};

export default Table;
