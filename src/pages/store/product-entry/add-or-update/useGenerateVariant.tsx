import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import Transfer from '@/components/buttons/transfer';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IProductEntry } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IProductEntry>;
	form: any;
	handleAttributes: (index: number) => void;
}

const useGenerateVariant = ({ copy, remove, watch, form, handleAttributes }: IGenerateFieldDefsProps): FieldDef[] => {
	return [
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
		{
			header: 'Attributes',
			accessorKey: 'attributes',
			type: 'custom',
			component: (index: number) => {
				return <Transfer onClick={() => handleAttributes(index)} type='button' />;
			},
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				return <FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />;
			},
		},
	];
};

export default useGenerateVariant;
