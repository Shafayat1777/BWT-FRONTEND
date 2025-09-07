import { useEffect } from 'react';
import { IProcessTableData } from '@/pages/work/_config/columns/columns.type';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import {
	useOtherBox,
	useOtherFloor,
	useOtherProblem,
	useOtherRack,
	useOtherWarehouse,
} from '@/lib/common-queries/other';
import { getDateTime } from '@/utils';

import { useWorkProcessesByUUID } from '../../_config/query';
import { IWorkProcess, PROCESS_NULL, PROCESS_SCHEMA } from '../../_config/schema';
import { IProcessAddOrUpdateProps } from '../../_config/types';

const AddOrUpdate: React.FC<IProcessAddOrUpdateProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	updateData,
}) => {
	const isUpdate = !!updatedData;

	const { user } = useAuth();
	const { data } = useWorkProcessesByUUID<IWorkProcess>(updatedData?.uuid as string);
	const { data: problemOption } = useOtherProblem<IFormSelectOption[]>('employee');
	const { data: warehouseOptions } = useOtherWarehouse<IFormSelectOption[]>();
	const { data: rackOption } = useOtherRack<IFormSelectOption[]>();
	const { data: floorOption } = useOtherFloor<IFormSelectOption[]>();
	const { data: boxOption } = useOtherBox<IFormSelectOption[]>();
	const form = useRHF(PROCESS_SCHEMA, PROCESS_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(PROCESS_NULL);
		setOpen((prev) => !prev);
		window.location.reload();
	};

	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	// Submit handler
	async function onSubmit(values: IProcessTableData) {
		if (isUpdate) {
			// UPDATE ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.uuid}`,
				updatedData: {
					...values,
					engineer_uuid:
						data?.status !== values.status ? (values.status ? user?.uuid : null) : values?.engineer_uuid,
					status_update_date:
						data?.status !== values.status
							? values.status
								? getDateTime()
								: null
							: values.status_update_date,
					updated_at: getDateTime(),
				},
				onClose,
			});
		}
	}

	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={isUpdate ? `Update ${updatedData?.process_id} Process #${updatedData?.index}` : 'Add New Process'}
			form={form}
			isSmall={true}
			onSubmit={onSubmit}
		>
			<div className='flex justify-end gap-2'>
				<FormField
					control={form.control}
					name='status'
					render={(props) => <CoreForm.Checkbox label='Done' {...props} />}
				/>
			</div>
			<div className='flex space-x-4'>
				<div className='flex-1'>
					<FormField
						control={form.control}
						name='problems_uuid'
						render={(props) => (
							<CoreForm.MultiSelect
								label='Problem'
								placeholder='Select Problems'
								options={problemOption!}
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
			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</AddModal>
	);
};

export default AddOrUpdate;
