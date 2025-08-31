import React, { Suspense, useState } from 'react';

import DataTableEntry from '@core/data-table/entry';

import { productSpecificationDetailsColumns, productVariantDetailsColumnsV2 } from '../../_config/columns';
import { IProductEntryTableData, IProductVariantValuesEntryTableData } from '../../_config/columns/columns.type';
import { flattenOrderData } from '../utills';
import AttributeModal from './attributes-modal';

const EntryTable: React.FC<{ data: IProductEntryTableData }> = ({ data }) => {
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);
	const [attribute, setAttribute] = useState<IProductVariantValuesEntryTableData[]>([]);

	const handleAttribute = (index: number) => {
		const value = data.product_variant[index].product_variant_values_entry;
		setAttribute(value);
		setIsOpenAddModal(true);
	};
	const columns = flattenOrderData(data).columnNames;
	

	const columnsVariant = productVariantDetailsColumnsV2(handleAttribute, columns);
	const columnsSpecification = productSpecificationDetailsColumns();
	return (
		<div className='flex flex-col gap-8'>
			<DataTableEntry
				title='Product Variant'
				columns={columnsVariant}
				data={flattenOrderData(data).flattened.product_variant || []}
				defaultVisibleColumns={{ created_at: false, updated_at: false, created_by_name: false, remarks: false }}
			/>
			<DataTableEntry
				title='Product Specification'
				columns={columnsSpecification}
				data={data?.product_specification || []}
				defaultVisibleColumns={{ created_at: false, updated_at: false, created_by_name: false, remarks: false }}
			/>

			<Suspense fallback={null}>
				<AttributeModal
					{...{
						data: attribute,
						open: isOpenAddModal,
						setOpen: setIsOpenAddModal,
					}}
				/>
			</Suspense>
		</div>
	);
};

export default EntryTable;
