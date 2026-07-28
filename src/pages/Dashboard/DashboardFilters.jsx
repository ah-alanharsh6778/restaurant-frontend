import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import CommonToolbar from '../../components/common/CommonToolbar';

export const DashboardFilters = ({
  selectedMonth = '',
  onMonthChange,
  selectedYear = '',
  onYearChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
}) => {
  const months = [
    { value: 'ALL', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: 'ALL', label: 'All Years' },
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear - 1), label: String(currentYear - 1) },
    { value: String(currentYear - 2), label: String(currentYear - 2) },
  ];

  const filterControls = (
    <>
      {/* Month Filter */}
      <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}>
        <InputLabel id="month-filter-label">Month</InputLabel>
        <Select
          labelId="month-filter-label"
          value={selectedMonth || 'ALL'}
          label="Month"
          onChange={(e) => onMonthChange(e.target.value)}
        >
          {months.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year Filter */}
      <FormControl size="small" sx={{ minWidth: 130, bgcolor: '#FAFBFD' }}>
        <InputLabel id="year-filter-label">Year</InputLabel>
        <Select
          labelId="year-filter-label"
          value={selectedYear || String(currentYear)}
          label="Year"
          onChange={(e) => onYearChange(e.target.value)}
        >
          {years.map((y) => (
            <MenuItem key={y.value} value={y.value}>
              {y.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Start Date */}
      <TextField
        size="small"
        type="date"
        label="From Date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}
      />

      {/* End Date */}
      <TextField
        size="small"
        type="date"
        label="To Date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 140, bgcolor: '#FAFBFD' }}
      />
    </>
  );

  return (
    <CommonToolbar
      filters={filterControls}
      actions={null}
    />
  );
};

export default DashboardFilters;
