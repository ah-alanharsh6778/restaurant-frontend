import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmptyState from '../EmptyState';

const formatCellValue = (val) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return val.name || val.title || val.label || val.tableNumber || val.status || '—';
  return String(val);
};

const formatChipLabel = (val) => {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'object') return val.name || val.title || val.status || val.label || 'N/A';
  return String(val);
};

export const DataTable = ({
  title,
  subtitle,
  columns = [],
  data = [],
  loading = false,
  onAddClick,
  addButtonLabel = 'Add New',
  actions = [],
  searchPlaceholder = 'Search records...',
  defaultRowsPerPage = 10,
  getRowId = (row) => row.id || row._id,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  // Menu action state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // Sorting Handler
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Search Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.field];
        if (!val) return false;
        if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(term);
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [data, columns, searchTerm]);

  // Sorted Data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (typeof aVal === 'object') aVal = aVal?.name || '';
      if (typeof bVal === 'object') bVal = bVal?.name || '';

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Pagination Slice
  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3.5,
        overflow: 'hidden',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header Toolbar */}
      {(title || onAddClick || searchPlaceholder) && (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" fontWeight={800} letterSpacing="-0.01em">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: { xs: '100%', sm: 240 } }}
            />

            {onAddClick && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onAddClick}
                sx={{ py: 0.9, px: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                {addButtonLabel}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Main Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || 'left'}
                  sortDirection={orderBy === col.field ? order : false}
                  sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  ACTIONS
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      <Skeleton variant="text" width="80%" height={24} />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell align="right">
                      <Skeleton variant="circular" width={28} height={28} sx={{ ml: 'auto' }} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
                  <EmptyState
                    title="No records found"
                    description={
                      searchTerm
                        ? `No matches found for "${searchTerm}". Try resetting your filter.`
                        : 'There are no items to display right now.'
                    }
                    actionLabel={onAddClick ? addButtonLabel : null}
                    onAction={onAddClick}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rowId = getRowId(row);
                return (
                  <TableRow
                    key={rowId}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((col) => {
                      const value = row[col.field];
                      const rawChipVal = typeof value === 'object' && value !== null ? (value.name || value.status) : value;

                      return (
                        <TableCell key={col.field} align={col.align || 'left'}>
                          {col.renderCell ? (
                            col.renderCell(row)
                          ) : col.type === 'chip' ? (
                            <Chip
                              label={formatChipLabel(value)}
                              size="small"
                              color={col.chipColor ? col.chipColor(rawChipVal) : 'default'}
                            />
                          ) : (
                            formatCellValue(value)
                          )}
                        </TableCell>
                      );
                    })}

                    {actions.length > 0 && (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenMenu(e, row)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Action Context Menu */}
      {actions.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          slotProps={{ paper: { elevation: 3, sx: { borderRadius: 3, minWidth: 160 } } }}
        >
          {actions.map((act, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                act.onClick(selectedRow);
                handleCloseMenu();
              }}
              sx={{ color: act.color || 'text.primary', py: 1, fontSize: '0.875rem' }}
            >
              {act.icon && <Box component="span" sx={{ mr: 1.5, display: 'inline-flex' }}>{act.icon}</Box>}
              {act.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
