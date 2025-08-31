import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import Transfer from '@/components/buttons/transfer';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';
import { IFormSelectOption } from '@core/form/types';

import { useOtherAttributes } from '@/lib/common-queries/other';

import { IProductEntryV2 } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	remove: (index: any) => void;
	watch?: UseFormWatch<IProductEntryV2>;
	form: any;
	isUpdate: boolean;
	updatedData?: IProductEntryV2['product_variant'][number] | null;
}

const useGenerateAttribute = ({ remove, form, updatedData }: IGenerateFieldDefsProps): FieldDef[] => {
	const { data: AttributeOptions } = useOtherAttributes<IFormSelectOption[]>();
	return [
		// {
		// 	header: 'Attribute',
		// 	accessorKey: 'attribute_uuid',
		// 	type: 'select',
		// 	placeholder: 'Select Attribute',
		// 	options: AttributeOptions || [],
		// },
		{
			header: 'Attribute',
			accessorKey: 'attribute_uuid',
			type: 'custom',
			component: (index: number) => {
				return (
					<FormField
						control={form.control}
						name={`product_variant.${updatedData?.index}.product_variant_values_entry.${index}.attribute_uuid`}
						render={(props) => (
							<CoreForm.Select
								isDisabled
								disableLabel
								placeholder='Select Attribute'
								options={AttributeOptions!}
								{...props}
							/>
						)}
					/>
				);
			},
		},
		{
			header: 'Value',
			accessorKey: 'value',
			type: 'text',
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
};

export default useGenerateAttribute;
