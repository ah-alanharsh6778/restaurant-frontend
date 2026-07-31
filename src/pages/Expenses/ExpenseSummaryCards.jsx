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
      id: 'total',
      title: 'Total Expenses',
      value: `$${totalExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AttachMoneyIcon sx={{ color: '#7C6CFF', fontSize: 20 }} />,
      circleBg: 'rgba(124, 108, 255, 0.12)',
      hideOnMobile: false,
    },
    {
      id: 'today',
      title: "Today's Expenses",
      value: `$${todayExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TodayIcon sx={{ color: '#10B981', fontSize: 20 }} />,
      circleBg: 'rgba(16, 185, 129, 0.12)',
      hideOnMobile: false,
    },
    {
      id: 'monthly',
      title: 'Monthly Expenses',
      value: `$${monthlyExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CalendarMonthIcon sx={{ color: '#3B82F6', fontSize: 20 }} />,
      circleBg: 'rgba(59, 130, 246, 0.12)',
      hideOnMobile: true,
    },
    {
      id: 'processed',
      title: 'Processed Invoices',
      value: processedCount,
      icon: <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />,
      circleBg: 'rgba(16, 185, 129, 0.12)',
      hideOnMobile: true,
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: pendingCount,
      icon: <HourglassEmptyIcon sx={{ color: '#F59E0B', fontSize: 20 }} />,
      circleBg: 'rgba(245, 158, 11, 0.12)',
      hideOnMobile: true,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid
          xs={6}
          sm={6}
          md={4}
          lg={2.4}
          key={card.id}
          sx={{
            display: card.hideOnMobile ? { xs: 'none', sm: 'block' } : 'block',
          }}
        >
          <Card
            elevation={0}
            sx={{
              p: 0.5,
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#131A24',
              height: '100%',
              boxSizing: 'border-box',
              transition: 'all 250ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'rgba(255, 255, 255, 0.16)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: '12px !important', sm: '20px !important' } }}>
              {loading ? (
                <Box>
                  <Skeleton variant="circular" width={36} height={36} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.06)' }} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                  <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: { xs: '11px', sm: '13px' }, display: 'block' }} noWrap>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.4, color: '#FFFFFF', fontSize: { xs: '16px', sm: '22px' } }} noWrap>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: card.circleBg,
                      width: { xs: 36, sm: 44 },
                      height: { xs: 36, sm: 44 },
                      borderRadius: '50%',
                      flexShrink: 0,
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
