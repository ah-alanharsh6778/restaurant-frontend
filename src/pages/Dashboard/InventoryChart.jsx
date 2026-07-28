import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const InventoryChart = ({ data = [] }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#FFFFFF',
        height: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Inventory Stock Levels vs Threshold
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Comparing current available stock against minimum safety threshold
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', height: 240, minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
            <Bar dataKey="currentStock" name="Current Stock" fill="#0D9488" radius={[4, 4, 0, 0]} />
            <Bar dataKey="minimumStock" name="Min Threshold" fill="#EA580C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default InventoryChart;
