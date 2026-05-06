import React from 'react';
import {
  TableHeaderRow,
  SortableTh,
  StaticTh,
} from '../../../components/ui/tableSortHeader';

const CustomerTableHeader = ({ onSort, sortField, sortOrder, getSortTooltip }) => (
  <TableHeaderRow>
    <SortableTh field="name"      label="Name"    onSort={onSort} sortField={sortField} sortOrder={sortOrder} getSortTooltip={getSortTooltip} />
    <StaticTh                     label="Email"   />
    <StaticTh                     label="Phone"   />
    <StaticTh                     label="Address" />
    <SortableTh field="createdAt" label="Created" onSort={onSort} sortField={sortField} sortOrder={sortOrder} getSortTooltip={getSortTooltip} />
    <StaticTh                     label="Actions" />
  </TableHeaderRow>
);

export default CustomerTableHeader;