import React from 'react';

import ColumnImage from '@/components/core/data-table/_views/column-image';
import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';

import { formatDateTable } from '@/utils/formatDate';

import { IProductEntryTableData } from '../../_config/columns/columns.type'; // TODO: update data type

const Information: React.FC<{ data: IProductEntryTableData }> = ({ data }) => {
	const renderItems = (): ITableListItems => {
		return [
			{
				label: 'Title',
				value: data.title,
			},
			{ label: 'Category', value: data.category_name },
			{ label: 'Model', value: data.model_name },
			{ label: 'Warranty', value: data.warranty_days },
			{ label: 'Specifications Desc.', value: data.specifications_description },
			{
				label: 'Product Images',
				value: (
					<div className='flex flex-wrap gap-2'>
						{data.product_image?.map((image, index) => (
							<ColumnImage src={image.image as string} alt={`image-${index + 1}`} />
						))}
					</div>
				),
			},
		];
	};

	const renderItems2 = (): ITableListItems => {
		return [
			{
				label: 'Created By',
				value: data.created_by_name,
			},
			{
				label: 'Created At',
				value: formatDateTable(data.created_at),
			},
			{
				label: 'Updated At',
				value: formatDateTable(data.updated_at),
			},
			{ label: 'Service Warranty', value: data.specifications_description },
			{ label: 'C&M Desc.', value: data.care_maintenance_description },
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
