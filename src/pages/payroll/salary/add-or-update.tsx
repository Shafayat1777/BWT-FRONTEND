import { useEffect } from 'react';
import { getMonth, getYear } from 'date-fns';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import { useOtherEmployees } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { ISalaryTableData } from '../_config/columns/columns.type';
import { usePayrollSalary, usePayrollSalaryByUUID } from '../_config/query';
import { ISalary, SALARY_NULL, SALARY_SCHEMA } from '../_config/schema';
import { IAddOrUpdateProps } from '../_config/types';
import { type } from '../utils';

const AddOrUpdate: React.FC<IAddOrUpdateProps<ISalaryTableData>> = ({
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
	const { invalidateQuery: invalidateUserQuery } = usePayrollSalary();
	const { data } = usePayrollSalaryByUUID<ISalary>(updatedData?.uuid as string);
	const { data: employees } = useOtherEmployees<IFormSelectOption[]>();

	const form = useRHF(SALARY_SCHEMA, SALARY_NULL);

	const disabled = false;

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(SALARY_NULL);
		invalidateUserQuery();
		setOpen((prev) => !prev);
	};

	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
	}, [data, isUpdate]);

	// Submit handler
	async function onSubmit(values: ISalary) {
		if (isUpdate) {
			// UPDATE ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.uuid}`,
				updatedData: {
					...values,
					month: getMonth(values.year_month)+1,
					year: getYear(values.year_month),
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
					created_at: getDateTime(),
					created_by: user?.uuid,
					month: getMonth(values.year_month)+1,
					year: getYear(values.year_month),
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
			title={isUpdate ? 'Update Salary Entry' : 'Add Salary Entry'}
			form={form}
			onSubmit={onSubmit}
		>
			<FormField
				control={form.control}
				name='employee_uuid'
				render={(props) => (
					<CoreForm.ReactSelect label='Employee' options={employees || []} isDisabled={disabled} {...props} />
				)}
			/>
			<FormField
				control={form.control}
				name='type'
				render={(props) => (
					<CoreForm.ReactSelect label='type' isDisabled={disabled} options={type || []} {...props} />
				)}
			/>
			<FormField
				control={form.control}
				name='amount'
				render={(props) => <CoreForm.JoinInputUnit unit='BDT' type='number' label='amount' {...props} />}
			/>

			{/* {form.watch('type') === 'partial' && (
				<>
					<FormField
						control={form.control}
						name='loan_amount'
						render={(props) => (
							<CoreForm.JoinInputUnit unit='Tk.' type='number' label='Loan Amount' {...props} />
						)}
					/>
					<FormField
						control={form.control}
						name='advance_amount'
						render={(props) => (
							<CoreForm.JoinInputUnit unit='Tk.' type='number' label='Advance Amount' {...props} />
						)}
					/>
				</>
			)} */}
			<FormField
				control={form.control}
				name='year_month'
				render={(props) => <CoreForm.MonthPicker label='Salary Month' {...props} />}
			/>
		</AddModal>
	);
};

export default AddOrUpdate;
