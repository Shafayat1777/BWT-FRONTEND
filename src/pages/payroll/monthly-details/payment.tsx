import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { usePayrollSalary } from '../_config/query';
import { IMonthlySalary, MONTHLY_SALARY_NULL, MONTHLY_SALARY_SCHEMA } from '../_config/schema';
import { IAddOrProps } from '../_config/types';
import { type } from '../utils';

const AddOrUpdate: React.FC<IAddOrProps<any>> = ({ url, open, setOpen, updatedData, setUpdatedData, postData }) => {
	const isUpdate = !!updatedData;
	const { user } = useAuth();
	const { invalidateQuery: invalidateUserQuery } = usePayrollSalary();

	const form = useRHF(MONTHLY_SALARY_SCHEMA, MONTHLY_SALARY_NULL);

	const disabled = false;

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(MONTHLY_SALARY_NULL);
		invalidateUserQuery();
		setOpen((prev) => !prev);
	};

	// Submit handler
	async function onSubmit(values: IMonthlySalary) {
		// ADD NEW ITEM
		postData.mutateAsync({
			url,
			newData: {
				...values,
				created_at: getDateTime(),
				created_by: user?.uuid,
				employee_uuid: updatedData?.employee_uuid,
				month: updatedData.current_month,
				year: updatedData.current_year,
				uuid: nanoid(),
			},
			onClose,
		});
	}

	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={`Add Salary Entry`}
			subtitle={`Net Payable: ${Number(updatedData?.net_payable).toFixed(2)} (BDT)`}
			form={form}
			onSubmit={onSubmit}
		>
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
							<CoreForm.JoinInputUnit unit='BDT' type='number' label='Loan Amount' {...props} />
						)}
					/>
					<FormField
						control={form.control}
						name='advance_amount'
						render={(props) => (
							<CoreForm.JoinInputUnit unit='BDT' type='number' label='Advance Amount' {...props} />
						)}
					/>
				</>
			)} */}
		</AddModal>
	);
};

export default AddOrUpdate;
