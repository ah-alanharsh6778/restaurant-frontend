import { Box, Chip } from '@mui/material';

export const ExpenseFilter = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: 'ALL', label: 'All Expenses' },
    { id: 'PROCESSED', label: 'Processed & Paid' },
    { id: 'PENDING', label: 'Pending Review' },
    { id: 'REJECTED', label: 'Rejected' },
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

export default ExpenseFilter;
