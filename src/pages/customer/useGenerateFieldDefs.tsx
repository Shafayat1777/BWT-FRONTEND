import { useState } from 'react';
import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';
import { IFormSelectOption } from '@core/form/types';

import { useOtherBrand, useOtherModelByQuery } from '@/lib/common-queries/other';

import { IInfo } from './_config/schema';
import ModelFilter from './model-filter';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IInfo>;
	isProductReceived?: boolean;
	form: any;
	isUpdate: boolean;
}

const useGenerateFieldDefs = ({ copy, remove, form, isUpdate }: IGenerateFieldDefsProps): FieldDef[] => {
	const [brand, setBrand] = useState([]);
	const { data: modelOption } = useOtherModelByQuery<IFormSelectOption[]>(`is_brand=false&brand_uuid=${brand}`);
	const { data: brandOptions } = useOtherBrand<IFormSelectOption[]>();
	return [
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				return <FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />;
			},
		},
		{
			header: 'Brand',
			accessorKey: 'brand_uuid',
			type: 'custom',
			component: (index: number) => {
				setBrand(form.watch(`order_entry.${index}.brand_uuid`));
				return (
					<FormField
						control={form.control}
						name={`order_entry.${index}.brand_uuid`}
						render={(props) => (
							<CoreForm.ReactSelect
								menuPortalTarget={document.body}
								label='Brand'
								options={brandOptions || []}
								placeholder='Select Brand'
								{...props}
							/>
						)}
					/>
				);
			},
		},
		{
			header: 'Model',
			accessorKey: 'model_uuid',
			type: 'custom',
			component: (index: number) => {
				return (
					<ModelFilter brand_uuid={form.watch(`order_entry.${index}.brand_uuid`)} form={form} index={index} />
				);
			},
		},
		{
			header: 'Problem Statement',
			accessorKey: 'problem_statement',
			type: 'textarea',
		},
		{
			header: 'Remarks',
			accessorKey: 'remarks',
			type: 'textarea',
		},
		{
			header: 'Image 1',
			accessorKey: 'image_1',
			type: 'custom',
			component: (index: number) => {
				return (
					<FormField
						control={form.control}
						name={`order_entry.${index}.image_1`}
						render={(props) => (
							<CoreForm.FileUpload
								subLabel={
									form.watch('type') === 'hero'
										? 'Recommend size (1905x723)'
										: 'Recommend ratio 1:1 (300x300)'
								}
								label='Image 1'
								className='h-full'
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
			header: 'Image 2',
			accessorKey: 'image_2',
			type: 'custom',
			component: (index: number) => {
				return (
					<FormField
						control={form.control}
						name={`order_entry.${index}.image_2`}
						render={(props) => (
							<CoreForm.FileUpload
								subLabel={
									form.watch('type') === 'hero'
										? 'Recommend size (1905x723)'
										: 'Recommend ratio 1:1 (300x300)'
								}
								label='Image 2'
								className='h-full'
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
			header: 'Image 3',
			accessorKey: 'image_3',
			type: 'custom',
			component: (index: number) => {
				return (
					<FormField
						control={form.control}
						name={`order_entry.${index}.image_3`}
						render={(props) => (
							<CoreForm.FileUpload
								subLabel={
									form.watch('type') === 'hero'
										? 'Recommend size (1905x723)'
										: 'Recommend ratio 1:1 (300x300)'
								}
								label='Image 3'
								className='h-full'
								fileType='image'
								isUpdate={isUpdate}
								{...props}
							/>
						)}
					/>
				);
			},
		},
	];
};

export default useGenerateFieldDefs;
