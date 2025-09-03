import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import {
	useOtherAccessories,
	useOtherBox,
	useOtherBrand,
	useOtherFloor,
	useOtherModelByQuery,
	useOtherProblem,
	useOtherRack,
	useOtherUserByQuery,
	useOtherWarehouse,
} from '@/lib/common-queries/other';
import { getDateTime } from '@/utils';

import { IDiagnosisTableData, IOrderTableData } from '../_config/columns/columns.type';
import { useWorkDiagnosis, useWorkOrderByUUID } from '../_config/query';
import { ORDER_NULL, ORDER_SCHEMA } from '../_config/schema';
import { IOrderAddOrUpdateProps } from '../_config/types';
import { ICustomUserType } from '../info/add-or-update/header';

const AddOrUpdate: React.FC<IOrderAddOrUpdateProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	updateData,
}) => {
	const isUpdate = !!updatedData;
	const { user } = useAuth();
	const { data } = useWorkOrderByUUID<IOrderTableData>(updatedData?.uuid as string);
	const { data: problemOption } = useOtherProblem<IFormSelectOption[]>('customer');
	const { data: warehouseOptions } = useOtherWarehouse<IFormSelectOption[]>();
	const { data: rackOption } = useOtherRack<IFormSelectOption[]>();
	const { data: floorOption } = useOtherFloor<IFormSelectOption[]>();
	const { data: boxOption } = useOtherBox<IFormSelectOption[]>();
	const { data: brandOptions } = useOtherBrand<IFormSelectOption[]>();
	const { invalidateQuery: invalidateDiagnosis } = useWorkDiagnosis<IDiagnosisTableData[]>();

	const form = useRHF(ORDER_SCHEMA, ORDER_NULL);
	const { data: modelOption, invalidateQuery: invalidateModel } = useOtherModelByQuery<IFormSelectOption[]>(
		`is_brand=false&brand_uuid=${form.watch('brand_uuid')}`
	);
	const { data: accessoriesOption } = useOtherAccessories<IFormSelectOption[]>();
	const { data: userOption } = useOtherUserByQuery<ICustomUserType[]>('?type=customer');
	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(ORDER_NULL);
		invalidateDiagnosis();
		invalidateModel();
		setOpen(false);
	};

	// Submit handler
	async function onSubmit(values: IOrderTableData) {
		const payload = {
			...values,
			updated_at: getDateTime(),
			ready_for_delivery_date:
				data?.is_ready_for_delivery !== values.is_ready_for_delivery
					? values.is_ready_for_delivery
						? getDateTime()
						: null
					: data?.ready_for_delivery_date,
		};

		const formData = {
			...payload,
		};

		// orderFields.forEach((field) => {
		// 	if (
		// 		payload[field as keyof typeof values] == null ||
		// 		payload[field as keyof typeof values] === undefined
		// 	) {
		// 		formData.delete(field);
		// 	}
		// });

		await updateData.mutateAsync({
			url: `${url}/${updatedData?.uuid}`,
			updatedData: formData,
			onClose,
		});
	}
	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={isUpdate ? `Update ${updatedData?.order_id} Order` : 'Add New Order'}
			form={form}
			isSmall={true}
			onSubmit={onSubmit}
		>
			<div className='flex justify-end gap-2'>
				<FormField
					control={form.control}
					name='is_diagnosis_need'
					render={(props) => <CoreForm.Checkbox label='Diagnosis Needed' {...props} />}
				/>
				<FormField
					control={form.control}
					name='is_proceed_to_repair'
					render={(props) => <CoreForm.Checkbox label='Proceed to Repair' {...props} />}
				/>
				<FormField
					control={form.control}
					name='is_transferred_for_qc'
					render={(props) => <CoreForm.Checkbox label='Transfer QC' {...props} />}
				/>
				<FormField
					control={form.control}
					name='is_ready_for_delivery'
					render={(props) => <CoreForm.Checkbox label='Ready for Delivery' {...props} />}
				/>
				<FormField
					control={form.control}
					name={`is_home_repair`}
					render={(props) => <CoreForm.Checkbox label='Home Repair' {...props} />}
				/>
				{form.watch(`is_home_repair`) && (
					<FormField
						control={form.control}
						name={`is_challan_needed`}
						render={(props) => <CoreForm.Checkbox label='Challan Needed' {...props} />}
					/>
				)}
			</div>
			<div className='flex space-x-4'>
				<div className='flex-1 flex flex-col gap-2'>
					<div className='flex-1'>
						<FormField
							control={form.control}
							name='brand_uuid'
							render={(props) => (
								<CoreForm.ReactSelect
									label='Brand'
									options={brandOptions || []}
									placeholder='Select Brand'
									{...props}
								/>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name='model_uuid'
						render={(props) => (
							<CoreForm.ReactSelectCreate
								label='Model'
								options={modelOption || []}
								placeholder='Select Model'
								{...props}
							/>
						)}
					/>
				</div>

				<div className=' flex-1 flex flex-col gap-2'>
					<FormField
						control={form.control}
						name='serial_no'
						render={(props) => <CoreForm.Input label='Serial Number' {...props} />}
					/>
					<FormField
						control={form.control}
						name='engineer_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								label='Engineer'
								menuPortalTarget={document.body}
								options={userOption!}
								placeholder='Select Engineer'
								{...props}
							/>
						)}
					/>
				</div>
				<div className='flex-1'>
					<FormField
						control={form.control}
						name='quantity'
						render={(props) => <CoreForm.Input type='number' label='Quantity' {...props} />}
					/>
				</div>
			</div>

			<div className='flex space-x-4'>
				<div className='flex-1'>
					<FormField
						control={form.control}
						name='problems_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								isMulti
								label='Problems'
								options={problemOption!}
								placeholder='Select Problems'
								{...props}
							/>
						)}
					/>
				</div>
				<div className='flex-1'>
					<FormField
						control={form.control}
						name='accessories'
						render={(props) => (
							<CoreForm.ReactSelect
								isMulti
								label='Accessories'
								options={accessoriesOption || []}
								placeholder='Select Accessories'
								{...props}
							/>
						)}
					/>
				</div>
			</div>
			<div className='flex space-x-4'>
				<div className='flex-1'>
					<FormField
						control={form.control}
						name='problem_statement'
						render={(props) => <CoreForm.Textarea label='Problem Statement' {...props} />}
					/>
				</div>
			</div>

			{!form.watch(`is_home_repair`) && (
				<div className='grid grid-cols-4 gap-4'>
					<FormField
						control={form.control}
						name='warehouse_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								label='Warehouse'
								options={warehouseOptions || []}
								placeholder='Select Warehouse'
								{...props}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='rack_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								label='Rack'
								options={rackOption || []}
								placeholder='Select Rack'
								{...props}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='floor_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								label='Floor'
								options={floorOption || []}
								placeholder='Select Floor'
								{...props}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='box_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								label='Box'
								options={boxOption || []}
								placeholder='Select Box'
								{...props}
							/>
						)}
					/>
				</div>
			)}

			<FormField
				control={form.control}
				name='remarks'
				render={(props) => <CoreForm.Textarea label='Remarks' {...props} />}
			/>
		</AddModal>
	);
};

export default AddOrUpdate;
