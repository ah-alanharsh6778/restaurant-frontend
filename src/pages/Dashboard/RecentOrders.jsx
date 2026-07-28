import {
  Paper,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Skeleton,
} from '@mui/material';
import EmptyState from '../../components/common/EmptyState';

export const RecentOrders = ({ orders = [], loading = false }) => {
  const latestFive = orders.slice(0, 5);

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
      case 'SERVED':
        return 'success';
      case 'PREPARING':
      case 'READY':
        return 'warning';
      case 'PENDING':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3.5,
        overflow: 'hidden',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        mb: 4,
      }}
    >
      <Box p={3} borderBottom={(theme) => `1px solid ${theme.palette.divider}`}>
        <Typography variant="h6" fontWeight={800}>
          Recent Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Latest 5 transactions recorded by the point of sale
        </Typography>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                ORDER NUMBER
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                TABLE
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                STATUS
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                AMOUNT ($)
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                CREATED DATE
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton width="80%" /></TableCell>
                  <TableCell><Skeleton width="60%" /></TableCell>
                  <TableCell><Skeleton width="40%" /></TableCell>
                  <TableCell><Skeleton width="50%" /></TableCell>
                  <TableCell><Skeleton width="70%" /></TableCell>
                </TableRow>
              ))
            ) : latestFive.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No recent orders"
                    description="No order records returned from backend API."
                  />
                </TableCell>
              </TableRow>
            ) : (
              latestFive.map((ord, idx) => {
                const orderNum = ord.orderNumber || `#ORD-${ord.id ? String(ord.id).slice(0, 6) : idx + 1}`;
                const tableStr = ord.table?.tableNumber || ord.tableNumber || 'Takeaway / Bar';
                const statusStr = typeof ord.status === 'object' ? ord.status?.name : (ord.status || 'PENDING');
                const amountNum = Number(ord.totalAmount || ord.total || 0).toFixed(2);
                const createdDateStr = ord.createdAt
                  ? new Date(ord.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Today';

                return (
                  <TableRow key={ord.id || idx} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{orderNum}</TableCell>
                    <TableCell>{tableStr}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusStr}
                        size="small"
                        color={getStatusChipColor(statusStr)}
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>${amountNum}</TableCell>
                    <TableCell color="text.secondary">{createdDateStr}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentOrders;
