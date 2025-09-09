import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import Transfer from '@/components/buttons/transfer';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IProductEntryV2 } from '../../_config/schema';
import Discount from './discount'

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IProductEntryV2>;
	form: any;
	dynamicColumns?: string[];
}

const useGenerateVariant = ({ copy, remove, watch, form, dynamicColumns }: IGenerateFieldDefsProps): FieldDef[] => {
	form.watch('is_order_exist');
	const baseFields: FieldDef[] = [
		{
			header: 'Selling Price',
			accessorKey: 'selling_price',
			type: 'number',
			disabled: (index): boolean => form.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`),
		},
		{
			header: 'Discount',
			accessorKey: 'discount',
			type: 'custom',
			component: (index: number) => {
				return <Discount form={form} index={index} />;
			},
		},
		{
			header: 'Selling Warehouse',
			accessorKey: 'selling_warehouse',
			type: 'number',
			disabled: (index): boolean => form.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`),
		},
	];

	// Generate dynamic column fields
	const dynamicFields: FieldDef[] = (dynamicColumns ?? []).map((columnName) => ({
		header: columnName,
		accessorKey: columnName,
		type: 'text',
		disabled: (index): boolean => form.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`),
	}));

	const endFields: FieldDef[] = [
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				if (form.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`)) {
					return '';
				}
				return <FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />;
			},
		},
	];

	return [...baseFields, ...dynamicFields, ...endFields];
};

export default useGenerateVariant;
