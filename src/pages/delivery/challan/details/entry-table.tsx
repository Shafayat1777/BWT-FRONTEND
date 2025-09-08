import React from 'react';

import DataTableEntry from '@core/data-table/entry';

import { challanEntryColumns } from '../../_config/columns';
import { IChallanTableData } from '../../_config/columns/columns.type';

const EntryTable: React.FC<{ data: IChallanTableData }> = ({ data }) => {
	const columns = challanEntryColumns();

	const grandTotal = data?.challan_entries?.reduce((total, entry) => total + entry.bill_amount, 0);

	return (
		<div>
			<DataTableEntry
				title='Challan Entry'
				columns={columns}
				data={data?.challan_entries || []}
				defaultVisibleColumns={{ updated_at: false, created_by_name: false }}
			/>
			<tr>
				<td className='border-t text-right font-semibold' colSpan={4}>
					Grand Total Bill:
				</td>

				<td className='border-t px-3 py-2'>{grandTotal}</td>
				<td className='border-t px-3 py-2'></td>
			</tr>
		</div>
	);
};

export default EntryTable;
