import { watch } from 'fs';
import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import DateTime from '@/components/ui/date-time';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';
import { IFormSelectOption } from '@core/form/types';

import {
	useOtherAccessories,
	useOtherBrand,
	useOtherProblem,
	useOtherUser,
	useOtherUserByQuery,
} from '@/lib/common-queries/other';

import { IInfo } from '../../_config/schema';
import ActionHeader from './action-header';
import Location from './location';
import ModelFilter from './model-filter';

interface IGenerateFieldDefsProps {
	copy: (index: any) => void;
	remove: (index: any) => void;
	watch?: UseFormWatch<IInfo>;
	isProductReceived?: boolean;
	form: any;
	isUpdate: boolean;
	handleReclaimed: (index: number, isReclaimed: boolean) => void;
}

const useGenerateFieldDefs = ({
	copy,
	remove,
	isProductReceived,
	form,
	isUpdate,
	handleReclaimed,
}: IGenerateFieldDefsProps): FieldDef[] => {
	const { data: problemOption } = useOtherProblem<IFormSelectOption[]>('customer');
	const { data: accessoriesOption } = useOtherAccessories<IFormSelectOption[]>();
	const { data: brandOptions } = useOtherBrand<IFormSelectOption[]>();
	const { data: userOptions } = useOtherUserByQuery<IFormSelectOption[]>(`?type=employee&department=engineer`);
	return [
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				if (
					form.watch(`order_entry.${index}.is_home_repair`) ||
					form.watch(`order_entry.${index}.is_proceed_to_repair`)
				) {
					return (
						<div className='flex w-full items-center justify-between'>
							<ActionHeader index={index} form={form} />
							<FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />
						</div>
					);
				}
				return (
					<div className='flex w-full items-center justify-between'>
						<ActionHeader index={index} form={form} />
						<FieldActionButton handleCopy={copy} handleRemove={remove} index={index} />
					</div>
				);
			},
		},
		{
			header: 'Proceed to Repair',
			accessorKey: 'is_proceed_to_repair',
			type: 'custom',
			component: (index: number) => {
				return (
					<div className='flex flex-col gap-4'>
						<div className='flex gap-2'>
							<FormField
								control={form.control}
								name={`order_entry.${index}.is_home_repair`}
								render={(props) => (
									<CoreForm.Checkbox
										label='Home Repair'
										{...props}
										onCheckedChange={(e) => {
											form.setValue(`order_entry.${index}.is_home_repair`, e);
											if (e) {
												form.setValue(`order_entry.${index}.is_proceed_to_repair`, false);
												form.setValue(`order_entry.${index}.bill_amount`, 0);
											}
										}}
									/>
								)}
							/>
							{form.watch(`order_entry.${index}.uuid`) && (
								<FormField
									control={form.control}
									name={`order_entry.${index}.is_reclaimed`}
									render={(props) => (
										<CoreForm.Checkbox
											label='Reclaimed'
											{...props}
											onCheckedChange={(e) => {
												form.setValue(`order_entry.${index}.is_reclaimed`, e);
												handleReclaimed(index, e as boolean);
											}}
										/>
									)}
								/>
							)}
							{form.watch(`order_entry.${index}.is_home_repair`) && (
								<FormField
									control={form.control}
									name={`order_entry.${index}.is_challan_needed`}
									render={(props) => <CoreForm.Checkbox label='Challan Needed' {...props} />}
								/>
							)}
						</div>
						<div className='flex gap-2'>
							<FormField
								control={form.control}
								name={`order_entry.${index}.is_diagnosis_need`}
								render={(props) => <CoreForm.Checkbox label='Diagnosis Needed' {...props} />}
							/>
						</div>
						<div className='flex gap-2'>
							{!form.watch(`order_entry.${index}.is_home_repair`) && (
								<FormField
									control={form.control}
									name={`order_entry.${index}.is_proceed_to_repair`}
									render={(props) => (
										<CoreForm.Checkbox
											label='Proceed to Repair'
											{...props}
											onCheckedChange={(e) => {
												form.setValue(`order_entry.${index}.is_proceed_to_repair`, e);
												if (!e) {
													form.setValue(`order_entry.${index}.bill_amount`, 0);
												}
											}}
										/>
									)}
								/>
							)}
							{form.watch(`order_entry.${index}.is_proceed_to_repair`) && (
								<FormField
									control={form.control}
									name={`order_entry.${index}.bill_amount`}
									render={(props) => <CoreForm.Input type='number' label='Bill Amount' {...props} />}
								/>
							)}
						</div>
					</div>
				);
			},
		},
		{
			header: 'Engineer',
			accessorKey: 'engineer_uuid',
			type: 'select',
			options: userOptions || [],
			placeholder: 'Select Engineer',
			disabled: !isProductReceived,
		},
		{
			header: 'Brand',
			accessorKey: 'brand_uuid',
			type: 'custom',
			component: (index: number) => {
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
		// {
		// 	header: 'Model',
		// 	accessorKey: 'model_uuid',
		// 	type: 'select',
		// 	options: modelOption || [],
		// 	placeholder: 'Select Model',
		// },
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
			header: 'Quantity',
			accessorKey: 'quantity',
			type: 'number',
		},
		{
			header: 'Advance Pay',
			accessorKey: 'advance_pay',
			type: 'number',
		},
		{
			header: 'Cost',
			accessorKey: 'cost',
			type: 'custom',
			component: (index: number) => {
				if (form.watch(`order_entry.${index}.is_home_repair`)) {
					return (
						<div className='flex gap-2'>
							<FormField
								control={form.control}
								name={`order_entry.${index}.proposed_cost`}
								render={(props) => <CoreForm.Input label='Proposed Cost' type='number' {...props} />}
							/>
							<FormField
								control={form.control}
								name={`order_entry.${index}.bill_amount`}
								render={(props) => <CoreForm.Input label='Bill Amount' type='number' {...props} />}
							/>
						</div>
					);
				}
			},
		},
		{
			header: 'Accessories',
			accessorKey: 'accessories',
			type: 'multiSelect',
			options: accessoriesOption || [],
			placeholder: 'Select Accessories',
			hidden: !isProductReceived,
		},
		{
			header: 'Serial No',
			accessorKey: 'serial_no',
			type: 'textarea',
			hidden: !isProductReceived,
		},
		{
			header: 'Problems',
			accessorKey: 'problems_uuid',
			type: 'multiSelect',
			options: problemOption || [],
			placeholder: 'Select Problems',
		},
		{
			header: 'Problem Statement',
			accessorKey: 'problem_statement',
			type: 'textarea',
		},
		{
			header: 'Warehouse',
			accessorKey: 'warehouse_uuid',
			type: 'custom',
			component: (index: number) => {
				return <Location form={form} index={index} />;
			},
			hidden: !isProductReceived,
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

		{
			header: 'Remarks',
			accessorKey: 'remarks',
			type: 'textarea',
		},
	];
};

export default useGenerateFieldDefs;
