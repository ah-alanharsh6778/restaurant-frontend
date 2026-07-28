import React from 'react';
import CommonToolbar from './CommonToolbar';

export const SearchToolbar = ({ searchQuery, onSearchChange, searchPlaceholder, filters, actions }) => {
  return (
    <CommonToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder || 'Search...'}
      filters={filters}
      actions={actions}
    />
  );
};

export default SearchToolbar;
