import React from 'react';

import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';

import { formatDateTable } from '@/utils/formatDate';

import { IPurchaseDetails } from '../../_config/columns/columns.type'; // TODO: update data type

const Information: React.FC<{ data: IPurchaseDetails }> = ({ data }) => {
	// TODO: update the renderItems to match the data type
	const renderItems = (): ITableListItems => {
		return [
			{
				label: 'id',
				value: data.id,
			},
			{ label: 'Stock', value: data.stock },
			{ label: 'UUID', value: data.uuid },
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
			<TableList items={renderItems()} />
		</SectionContainer>
	);
};

export default Information;
