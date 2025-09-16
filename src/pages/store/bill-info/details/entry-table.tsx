import React from 'react';

import DataTableEntry from '@core/data-table/entry';

import { OrderDetailsColumns } from '../../_config/columns';
import { IBillInfo } from '../../_config/columns/columns.type';
import { flattenOrderData } from '../utills';

const EntryTable: React.FC<{ data: IBillInfo; invalidateQuery: any }> = ({ data, invalidateQuery }) => {
	const columns = OrderDetailsColumns({
		dynamicColumns: flattenOrderData(data).columnNames,
		is_paid: data?.is_paid,
		invalidateQuery
	});

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
