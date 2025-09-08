import { useState } from 'react';
import { divide } from 'lodash';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import CoreForm from '@core/form';
import { IFormSelectOption } from '@core/form/types';

import { useOtherAttributes, useOtherCategory, useOtherModel } from '@/lib/common-queries/other';

import { IProductEntryV2 } from '../../_config/schema';
import useGenerateImage from './useGenerateImage';
import { NotebookPen } from 'lucide-react';

const Header = ({
	setDeleteItem,
}: {
	setDeleteItem: React.Dispatch<
		React.SetStateAction<{
			type?: string;
			url?: string;
			id: string;
			name: string;
		} | null>
	>;
}) => {
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;

	const form = useFormContext<IProductEntryV2>();

	const { data: categoryOptions } = useOtherCategory<IFormSelectOption[]>();
	const { data: modelOptions } = useOtherModel<IFormSelectOption[]>();
	const { data: AttributeOptions } = useOtherAttributes<IFormSelectOption[]>();

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'product_image',
	});

	const handleAdd = () => {
		append({
			product_uuid: '',
			image: '',
			is_main: false,
		});
	};

	// Delete Handler
	const handleRemove = (index: number) => {
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: `Image ${index + 1}`,
				url: '/store/product-image',
			});
		} else {
			remove(index);
		}
	};

	// Copy Handler
	const handleCopy = (index: number) => {
		const field = form.watch('product_image')[index];
		append({
			product_uuid: field.product_uuid,
			image: field.image,
			is_main: field.is_main,
		});
	};

	return (
		<CoreForm.Section
			title={`Product Info`}
			className='flex flex-col'
			extraHeader={
				<div className='flex items-center gap-3 text-white'>
					{form.watch('is_order_exist') && (
						<span className='rounded-sm bg-red-200 p-2 text-xs text-red-700 flex gap-1'>
							<NotebookPen size={16} />
							Note: This product already have order. so you can't change some filed here
						</span>
					)}
					<FormField
						control={form.control}
						name='is_published'
						render={(props) => <CoreForm.Switch label='Published' {...props} />}
					/>
				</div>
			}
		>
			<div className='grid grid-cols-3 gap-4'>
				<FormField
					control={form.control}
					name='title'
					render={(props) => <CoreForm.Input disabled={form.watch('is_order_exist')} {...props} />}
				/>
				<FormField
					control={form.control}
					name='category_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Category'
							placeholder='Select Category'
							isDisabled={form.watch('is_order_exist')}
							options={categoryOptions!}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='model_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							label='Model'
							placeholder='Select Model'
							menuPortalTarget={document.body}
							isDisabled={form.watch('is_order_exist')}
							options={modelOptions!}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='warranty_days'
					render={(props) => <CoreForm.Input type='number' {...props} />}
				/>
				<FormField
					control={form.control}
					name='service_warranty_days'
					render={(props) => <CoreForm.Input label='Service Warranty' type='number' {...props} />}
				/>{' '}
				<FormField
					control={form.control}
					name='attribute_list'
					render={(props) => (
						<CoreForm.ReactSelect
							placeholder='Select Attributes'
							menuPortalTarget={document.body}
							options={AttributeOptions!}
							isDisabled={form.watch('is_order_exist')}
							isMulti
							{...props}
						/>
					)}
				/>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					control={form.control}
					name='specifications_description'
					render={(props) => <CoreForm.Textarea label='Specs Description' {...props} />}
				/>
				<FormField
					control={form.control}
					name='care_maintenance_description'
					render={(props) => <CoreForm.Textarea label='Care Maintenance Description' {...props} />}
				/>
			</div>

			<CoreForm.DynamicFields
				title='Product Images'
				form={form}
				fieldName='product_image'
				fieldDefs={useGenerateImage({
					copy: handleCopy,
					remove: handleRemove,
					watch: form.watch,
					form,
					isUpdate,
				})}
				handleAdd={handleAdd}
				fields={fields}
			></CoreForm.DynamicFields>
		</CoreForm.Section>
	);
};

export default Header;
