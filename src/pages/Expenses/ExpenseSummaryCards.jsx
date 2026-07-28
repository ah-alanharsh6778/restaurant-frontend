import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import dayjs from 'dayjs';

export const ExpenseSummaryCards = ({ expenses = [], loading = false }) => {
  const now = dayjs();

  const totalExpenseSum = expenses.reduce((acc, exp) => acc + Number(exp.total || exp.amount || 0), 0);

  const todayExpenseSum = expenses
    .filter((exp) => dayjs(exp.invoiceDate || exp.createdAt).isSame(now, 'day'))
    .reduce((acc, exp) => acc + Number(exp.total || exp.amount || 0), 0);

  const monthlyExpenseSum = expenses
    .filter((exp) => dayjs(exp.invoiceDate || exp.createdAt).isSame(now, 'month'))
    .reduce((acc, exp) => acc + Number(exp.total || exp.amount || 0), 0);

  const processedCount = expenses.filter((exp) => exp.status === 'PROCESSED').length;
  const pendingCount = expenses.filter((exp) => exp.status === 'PENDING').length;

  const cards = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AttachMoneyIcon sx={{ color: '#2563EB' }} />,
      bgColor: '#EFF6FF',
      borderColor: '#93C5FD',
    },
    {
      title: "Today's Expenses",
      value: `$${todayExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TodayIcon sx={{ color: '#059669' }} />,
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    {
      title: 'Monthly Expenses',
      value: `$${monthlyExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CalendarMonthIcon sx={{ color: '#7C3AED' }} />,
      bgColor: '#F5F3FF',
      borderColor: '#C4B5FD',
    },
    {
      title: 'Processed Invoices',
      value: processedCount,
      icon: <CheckCircleIcon sx={{ color: '#16A34A' }} />,
      bgColor: '#F0FDF4',
      borderColor: '#86EFAC',
    },
    {
      title: 'Pending Review',
      value: pendingCount,
      icon: <HourglassEmptyIcon sx={{ color: '#D97706' }} />,
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      isWarning: pendingCount > 0,
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card
            elevation={0}
            sx={{
              p: 0.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: card.borderColor,
              bgcolor: '#FFFFFF',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {loading ? (
                <Box>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: card.isWarning ? 'warning.main' : 'text.primary' }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ExpenseSummaryCards;
