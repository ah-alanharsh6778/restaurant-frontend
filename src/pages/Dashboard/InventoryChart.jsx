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
        bgcolor: 'background.paper',
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} />
            <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
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
