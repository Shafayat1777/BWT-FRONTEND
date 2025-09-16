import React from 'react';

import DataTableEntry from '@core/data-table/entry';

import { OrderDetailsColumns, purchaseEntryColumns } from '../../_config/columns';
import { IBillInfo, IPurchaseDetails } from '../../_config/columns/columns.type';
import { flattenOrderData } from '../utills';

const EntryTable: React.FC<{ data: IBillInfo }> = ({ data }) => {
	const columns = OrderDetailsColumns({ dynamicColumns: flattenOrderData(data).columnNames, is_paid: data?.is_paid });

	return (
		<DataTableEntry
			title='Order Entry'
			columns={columns}
			data={flattenOrderData(data).flattened.order_details || []}
			defaultVisibleColumns={{ created_at: false, updated_at: false, created_by_name: false }}
		/>
	);
};

export default EntryTable;
