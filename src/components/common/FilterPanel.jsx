import React from 'react';
import CommonToolbar from './CommonToolbar';

export const FilterPanel = ({ searchQuery, onSearchChange, searchPlaceholder, filters, actions }) => {
  return (
    <CommonToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder || 'Filter items...'}
      filters={filters}
      actions={actions}
    />
  );
};

export default FilterPanel;
