import React from 'react';
import {
  TableHeaderRow,
  SortableTh,
  StaticTh,
} from '../../../components/ui/tableSortHeader';

const StaffTableHeader = ({ onSort, sortField, sortOrder, getSortTooltip }) => (
  <TableHeaderRow>
    <SortableTh field="fullName"  label="Name"    onSort={onSort} sortField={sortField} sortOrder={sortOrder} getSortTooltip={getSortTooltip} />
    <StaticTh                     label="Phone"   />
    <StaticTh                     label="Email"   />
    <StaticTh                     label="Status"  />
    <SortableTh field="createdAt" label="Created" onSort={onSort} sortField={sortField} sortOrder={sortOrder} getSortTooltip={getSortTooltip} />
    <StaticTh                     label="Actions" />
  </TableHeaderRow>
);

export default StaffTableHeader;