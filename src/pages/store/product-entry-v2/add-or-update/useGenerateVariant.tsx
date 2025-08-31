import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import Transfer from '@/components/buttons/transfer';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IProductEntryV2 } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IProductEntryV2>;
	form: any;
	dynamicColumns?: string[];
}

const useGenerateVariant = ({
	copy,
	remove,
	watch,
	form,
	dynamicColumns,
}: IGenerateFieldDefsProps): FieldDef[] => {
	const baseFields: FieldDef[] = [
		{
			header: 'Selling Price',
			accessorKey: 'selling_price',
			type: 'number',
		},
		{
			header: 'Discount',
			accessorKey: 'discount',
			type: 'number',
		},
		{
			header: 'Warehouse 1',
			accessorKey: 'warehouse_1',
			type: 'number',
		},
		{
			header: 'Warehouse 2',
			accessorKey: 'warehouse_2',
			type: 'number',
		},
		{
			header: 'Warehouse 3',
			accessorKey: 'warehouse_3',
			type: 'number',
		},
		{
			header: 'Selling Warehouse',
			accessorKey: 'selling_warehouse',
			type: 'number',
		},
	];

	// Generate dynamic column fields
	const dynamicFields: FieldDef[] = (dynamicColumns ?? []).map((columnName) => ({
		header: columnName,
		accessorKey: columnName,
		type: 'text',
		
	}));

	const endFields: FieldDef[] = [
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				return <FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />;
			},
		},
	];

	return [...baseFields, ...dynamicFields, ...endFields];
};

export default useGenerateVariant;
