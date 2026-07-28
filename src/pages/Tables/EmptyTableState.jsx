import { Paper, Typography, Button, Avatar } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import AddIcon from '@mui/icons-material/Add';

export const EmptyTableState = ({ onAddTable, searchOrFilterActive = false }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
      }}
    >
      <Avatar
        sx={{
          width: 72,
          height: 72,
          bgcolor: '#F1F5F9',
          color: 'primary.main',
          mb: 2,
        }}
      >
        <TableBarIcon sx={{ fontSize: 40 }} />
      </Avatar>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {searchOrFilterActive ? 'No Matching Tables Found' : 'No Tables Available'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mb: 3 }}>
        {searchOrFilterActive
          ? 'No tables match your current search query or filter criteria. Try clearing filters or searching for another table number.'
          : 'Get started by creating your first restaurant table to manage capacity, status, and floor layouts.'}
      </Typography>

      {onAddTable && !searchOrFilterActive && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddTable}
          sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700 }}
        >
          Add Table
        </Button>
      )}
    </Paper>
  );
};

export default EmptyTableState;
