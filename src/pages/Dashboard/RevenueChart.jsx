import { Paper, Box, Typography, Chip } from '@mui/material';
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

const defaultRevenueData = [
  { time: '08:00', sales: 420, orders: 12 },
  { time: '10:00', sales: 850, orders: 24 },
  { time: '12:00', sales: 2400, orders: 68 },
  { time: '14:00', sales: 1950, orders: 52 },
  { time: '16:00', sales: 1100, orders: 31 },
  { time: '18:00', sales: 3200, orders: 89 },
  { time: '20:00', sales: 4100, orders: 112 },
  { time: '22:00', sales: 1800, orders: 45 },
];

export const RevenueChart = ({ data = defaultRevenueData }) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Revenue & Sales Trend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hourly breakdown of total restaurant receipts ($)
          </Typography>
        </Box>
        <Chip label="Live Stream" size="small" color="primary" sx={{ fontWeight: 800 }} />
      </Box>

      <Box sx={{ width: '100%', height: 320, minHeight: 240, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={240}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(val) => `$${val}`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              name="Sales Amount ($)"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
