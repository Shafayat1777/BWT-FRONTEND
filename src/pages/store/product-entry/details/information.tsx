import React from 'react';

import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';

import { formatDateTable } from '@/utils/formatDate';

import { IPurchaseDetails } from '../../_config/columns/columns.type'; // TODO: update data type

const Information: React.FC<{ data: IPurchaseDetails }> = ({ data }) => {
	const renderItems = (): ITableListItems => {
		return [
			{
				label: 'ID',
				value: data.purchase_id,
			},
			{ label: 'Vendor', value: data.vendor_name },
			{ label: 'Branch', value: data.branch_name },
			{
				label: 'Date',
				value: formatDateTable(data.date),
			},
		];
	};
	const renderItems2 = (): ITableListItems => {
		return [
			{
				label: 'Created At',
				value: formatDateTable(data.created_at),
			},
			{
				label: 'Updated At',
				value: formatDateTable(data.updated_at),
			},
			{ label: 'Remarks', value: data.remarks },
		];
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<TableList items={renderItems()} />
				<TableList items={renderItems2()} />
			</div>
		</SectionContainer>
	);
};

export default Information;
