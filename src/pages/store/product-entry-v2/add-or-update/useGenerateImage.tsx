import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';

import { IProductEntryV2 } from '../../_config/schema';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IProductEntryV2>;
	form: any;
	isUpdate: boolean;
}

const useGenerateImage = ({ copy, remove, isUpdate, form }: IGenerateFieldDefsProps): FieldDef[] => {
	return [
		{
			header: 'Serial No',
			accessorKey: 'serial_no',
			type: 'custom',
			component: (index: number) => {
				return (
					<FormField
						control={form.control}
						name={`product_image.${index}.image`}
						render={(props) => (
							<CoreForm.FileUpload
								label={`Image ${index + 1}`}
								fileType='image'
								isUpdate={isUpdate}
								{...props}
							/>
						)}
					/>
				);
			},
		},
		{
			header: 'Banner Image',
			accessorKey: 'is_main',
			type: 'checkbox',
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

export default useGenerateImage;
