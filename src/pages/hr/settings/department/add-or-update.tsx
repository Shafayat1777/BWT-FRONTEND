import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';



import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';



import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';



import { useHrDepartmentsByUUID, useHrDesignations, useHrUsers } from '../_config/query';
import { DEPARTMENT_NULL, DEPARTMENT_SCHEMA, IDepartment } from '../_config/schema';
import { IDepartmentAddOrUpdateProps } from '../_config/types';
import { IDepartmentTableData } from '../../_config/columns/columns.type';


const AddOrUpdate: React.FC<IDepartmentAddOrUpdateProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	postData,
	updateData,
}) => {
	const isUpdate = !!updatedData;

	const { user } = useAuth();
	const { invalidateQuery: invalidateUsers } = useHrUsers();
	const { invalidateQuery: invalidateDesignations } = useHrDesignations();
	const { data } = useHrDepartmentsByUUID<IDepartmentTableData>(updatedData?.uuid as string);

	const form = useRHF(DEPARTMENT_SCHEMA, DEPARTMENT_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(DEPARTMENT_NULL);
		invalidateUsers();
		invalidateDesignations();
		setOpen((prev) => !prev);
	};

	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	// Submit handler
	async function onSubmit(values: IDepartment) {
		if (isUpdate) {
			// UPDATE ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.uuid}`,
				updatedData: {
					...values,
					department: values.name,
					updated_at: getDateTime(),
				},
				onClose,
			});
		} else {
			// ADD NEW ITEM
			postData.mutateAsync({
				url,
				newData: {
					...values,
					department: values.name,
					created_at: getDateTime(),
					created_by: user?.uuid,
					uuid: nanoid(),
				},
				onClose,
			});
		}
	}

	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={isUpdate ? 'Update Department' : 'Add Department'}
			form={form}
			onSubmit={onSubmit}
		>
			<FormField control={form.control} name='status' render={(props) => <CoreForm.Checkbox {...props} />} />
			<FormField control={form.control} name='name' render={(props) => <CoreForm.Input {...props} />} />
			<FormField
				control={form.control}
				name='hierarchy'
				render={(props) => <CoreForm.Input type='number' {...props} />}
			/>
			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</AddModal>
	);
};

export default AddOrUpdate;