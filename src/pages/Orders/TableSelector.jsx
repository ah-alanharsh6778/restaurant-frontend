import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';

export const TableSelector = ({ tables = [], selectedTableId, onSelectTable }) => {
  const displayTables = tables.length > 0 ? tables : [
    { id: '1', tableNumber: 'T-1', capacity: 2, status: 'AVAILABLE' },
    { id: '2', tableNumber: 'T-2', capacity: 4, status: 'AVAILABLE' },
    { id: '3', tableNumber: 'T-3', capacity: 4, status: 'OCCUPIED' },
    { id: '4', tableNumber: 'T-4', capacity: 6, status: 'AVAILABLE' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={800} color="text.secondary" gutterBottom>
        SELECT DINING TABLE
      </Typography>
      <Grid container spacing={1.5}>
        {displayTables.map((t) => {
          const isSelected = selectedTableId === (t.id || t._id);
          const isOccupied = t.status === 'OCCUPIED';

          return (
            <Grid xs={6} sm={3} key={t.id || t._id}>
              <Card
                elevation={isSelected ? 4 : 1}
                onClick={() => onSelectTable(t.id || t._id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: (theme) =>
                    isSelected
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                  backgroundColor: (theme) =>
                    isSelected
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(37, 99, 235, 0.2)'
                        : 'rgba(37, 99, 235, 0.08)'
                      : theme.palette.background.paper,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <TableBarIcon color={isSelected ? 'primary' : 'action'} fontSize="small" />
                      <Typography variant="subtitle2" fontWeight={800}>
                        {t.tableNumber}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.4}>
                      <PeopleIcon fontSize="caption" color="action" />
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        {t.capacity}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TableSelector;
