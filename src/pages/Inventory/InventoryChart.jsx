import { Paper, Box, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const defaultStockMovementData = [
  { day: 'Mon', stockIn: 120, stockOut: 45 },
  { day: 'Tue', stockIn: 80, stockOut: 60 },
  { day: 'Wed', stockIn: 150, stockOut: 90 },
  { day: 'Thu', stockIn: 60, stockOut: 55 },
  { day: 'Fri', stockIn: 210, stockOut: 110 },
  { day: 'Sat', stockIn: 180, stockOut: 140 },
  { day: 'Sun', stockIn: 90, stockOut: 85 },
];

export const InventoryChart = ({ data = defaultStockMovementData }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3.5,
        height: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" fontWeight={800}>
        Stock In vs Stock Out Movement
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Weekly comparison of inventory receipts against kitchen usage
      </Typography>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="stockIn"
              name="Stock In (Receipts)"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="stockOut"
              name="Stock Out (Usage)"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.2}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default InventoryChart;
