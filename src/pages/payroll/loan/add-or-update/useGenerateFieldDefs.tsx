import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';
import { IFormSelectOption } from '@core/form/types';

import {
	useOtherBox,
	useOtherFloor,
	useOtherProduct,
	useOtherRack,
	useOtherWarehouse,
	useOtherWarehouseByQuery,
} from '@/lib/common-queries/other';

import { ILoan } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<ILoan>;
	form: any;
}

const useGenerateFieldDefs = ({ copy, remove, watch, form }: IGenerateFieldDefsProps): FieldDef[] => {
	const payOption = [
		{
			label: 'Partial',
			value: 'partial',
		},
		{ label: 'Full', value: 'full' },
	];
	return [
		{
			header: 'Type',
			accessorKey: 'type',
			type: 'select',
			placeholder: 'Select Type',
			options: payOption || [],
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			type: 'number',
		},

		{
			header: 'Date',
			accessorKey: 'date',
			type: 'date',
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
				return <FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />;
			},
		},
	];
};

export default useGenerateFieldDefs;
