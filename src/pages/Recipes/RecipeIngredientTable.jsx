import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const RecipeIngredientTable = ({ ingredients = [], onRemove }) => {
  if (!ingredients || ingredients.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No ingredients added to this recipe yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>INGREDIENT</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>QUANTITY REQUIRED</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.map((item, idx) => {
            const ingName = item.ingredient?.name || item.name || `Ingredient #${idx + 1}`;
            const unitStr = item.ingredient?.unit || item.unit || '';
            const qtyNum = item.quantity || 1;
            const itemId = item.id || item._id;

            return (
              <TableRow key={itemId || idx} hover>
                <TableCell sx={{ fontWeight: 700 }}>{ingName}</TableCell>
                <TableCell>
                  <strong>{qtyNum}</strong> {unitStr}
                </TableCell>
                <TableCell align="right">
                  {onRemove && (
                    <Tooltip title="Remove Ingredient">
                      <IconButton size="small" color="error" onClick={() => onRemove(itemId || idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecipeIngredientTable;
