import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IChallan } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	entry: string;
	remove: (index: any) => void;
	add?: (index: any) => void;
	watch?: UseFormWatch<IChallan>;
}

const useGenerateFieldDefs = ({ entry, remove, watch, add }: IGenerateFieldDefsProps): FieldDef[] => {
	return [
		{
			header: 'Order',
			accessorKey: 'order',
			type: 'custom',
			component: (index: number) => {
				const orderId = watch ? String(watch(`${entry}.${index}.order_id` as any)) : '';

				return <span>{orderId}</span>;
			},
		},
		{
			header: 'Model',
			accessorKey: 'model_name',
			type: 'custom',
			component: (index: number) => {
				const orderId = watch ? String(watch(`${entry}.${index}.model_name` as any)) : '';

				return <span>{orderId}</span>;
			},
		},

		{
			header: 'Size',
			accessorKey: 'size_name',
			type: 'custom',
			component: (index: number) => {
				const orderId = watch ? String(watch(`${entry}.${index}.size_name` as any)) : '';

				return <span>{orderId}</span>;
			},
		},
		{
			header: 'Quantity',
			accessorKey: 'quantity',
			type: 'custom',
			component: (index: number) => {
				const orderId = watch ? String(watch(`${entry}.${index}.quantity` as any)) : '';

				return <span>{orderId}</span>;
			},
		},
		{
			header: 'Serial No',
			accessorKey: 'serial_no',
			type: 'custom',
			component: (index: number) => {
				const orderId = watch ? String(watch(`${entry}.${index}.serial_no` as any)) : '';

				return <span>{orderId}</span>;
			},
		},
		{
			header: 'Accessories',
			accessorKey: 'accessories',
			type: 'custom',
			component: (index: number) => {
				const accessories = watch ? watch(`${entry}.${index}.accessories` as any) : [];

				return (
					<div className='flex flex-wrap gap-1'>
						{accessories?.map((item: string, index: number) => (
							<span key={index} className='rounded-[10px] bg-accent px-2 py-1 capitalize text-white'>
								{item.replace(/_/g, '\n')}
							</span>
						))}
					</div>
				);
			},
		},
		{
			header: 'Remarks',
			accessorKey: 'remarks',
			type: 'textarea',
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				if (entry === 'new_challan_entries') {
					return <FieldActionButton handleAdd={add} index={index} />;
				} else {
					return <FieldActionButton handleRemove={remove} index={index} />;
				}
			},
		},
	];
};

export default useGenerateFieldDefs;
