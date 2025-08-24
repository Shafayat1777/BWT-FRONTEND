import React from 'react';

import DataTableEntry from '@core/data-table/entry';

import { purchaseEntryColumns } from '../../_config/columns';
import { IPurchaseDetails } from '../../_config/columns/columns.type';

const EntryTable: React.FC<{ data: IPurchaseDetails }> = ({ data }) => {
	const columns = purchaseEntryColumns();

	return (
		<DataTableEntry
			title='Purchase Entry'
			columns={columns}
			data={data?.purchase_entry || []}
			defaultVisibleColumns={{ created_at: false, updated_at: false, created_by_name: false }}
		/>
	);
};

export default EntryTable;
