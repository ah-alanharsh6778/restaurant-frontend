import { Box, Chip } from '@mui/material';

export const OrderFilter = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'TODAY', label: "Today's Orders" },
    { id: 'PENDING', label: 'Pending Kitchen Queue' },
    { id: 'COMPLETED', label: 'Paid & Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
      {filters.map((f) => (
        <Chip
          key={f.id}
          label={f.label}
          clickable
          color={selectedFilter === f.id ? 'primary' : 'default'}
          variant={selectedFilter === f.id ? 'filled' : 'outlined'}
          onClick={() => onFilterChange(f.id)}
          sx={{ fontWeight: 700, borderRadius: 2.5, py: 1.8 }}
        />
      ))}
    </Box>
  );
};

export default OrderFilter;
