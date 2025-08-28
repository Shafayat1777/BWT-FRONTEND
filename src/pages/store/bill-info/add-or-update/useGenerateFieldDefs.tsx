import { useMemo } from 'react';
import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IBillInfo } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	remove: (index: any) => void;
	watch?: UseFormWatch<IBillInfo>;
	form: any;
	dynamicColumns?: string[]; // Add this prop for dynamic columns
}

const useGenerateFieldDefs = ({ remove, watch, form, dynamicColumns = [] }: IGenerateFieldDefsProps): FieldDef[] => {
	const baseFields: FieldDef[] = [
		{
			header: 'Product',
			accessorKey: 'product_title',
			type: 'readOnly',
		},
	];

	// Generate dynamic column fields
	const dynamicFields: FieldDef[] = dynamicColumns.map((columnName) => ({
		header: columnName,
		accessorKey: columnName,
		type: 'readOnly',
		disabled: true,
	}));

	const endFields: FieldDef[] = [
		{
			header: 'Quantity',
			accessorKey: 'quantity',
			type: 'number',
		},
		{
			header: 'Selling Price',
			accessorKey: 'selling_price',
			type: 'readOnly',
			disabled: true,
		},
		{
			header: 'Total',
			accessorKey: 'total_price',
			type: 'custom',
			disabled: true,
			component: (index: number) => {
				return (
					<div className='flex items-center gap-2'>
						<div>
							{form.getValues(`order_details.${index}.quantity`) *
								form.getValues(`order_details.${index}.selling_price`)}
						</div>
					</div>
				);
			},
		},
		// {
		// 	header: 'Status',
		// 	accessorKey: 'order_status',
		// 	type: 'select',
		// 	options: [
		// 		{
		// 			label: 'Pending',
		// 			value: 'pending',
		// 		},
		// 		{
		// 			label: 'Completed',
		// 			value: 'completed',
		// 		},
		// 		{
		// 			label: 'Cancelled',
		// 			value: 'cancelled',
		// 		},
		// 	],
		// },
		{
			header: 'Serial',
			accessorKey: 'product_serial',
			type: 'readOnly',
			disabled: true,
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				return <FieldActionButton handleRemove={remove} index={index} />;
			},
		},
	];

	return [...baseFields, ...dynamicFields, ...endFields];
};

export default useGenerateFieldDefs;
