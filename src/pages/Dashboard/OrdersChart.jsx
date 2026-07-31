import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

export const OrdersChart = ({ data = [] }) => {
  const COLORS = ['#16A34A', '#D97706', '#2563EB', '#64748B', '#DC2626'];

  const filteredData = data.filter((item) => item.value > 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Orders Status Breakdown
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Distribution of order fulfillment statuses
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', height: 240, minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={240}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={filteredData.length > 0 ? filteredData : [{ name: 'No Orders', value: 1 }]}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {(filteredData.length > 0 ? filteredData : [{ name: 'No Orders', value: 1 }]).map(
                (entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                )
              )}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
              }}
              formatter={(value, name) => [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default OrdersChart;
