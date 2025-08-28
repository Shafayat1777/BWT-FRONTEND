import { it } from 'node:test';
import { lazy, Suspense, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import ReadFile from '@/components/buttons/read-file';
import { ShowLocalToast } from '@/components/others/toast';
import CoreForm from '@core/form';

import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { usePayrollSalary } from '../_config/query';
import { IMonthlyBulkSalary, MONTHLY_BULK_SALARY_NULL, MONTHLY_BULK_SALARY_SCHEMA } from '../_config/schema';
import useGenerateFieldDefs from './useGenerateFieldDefs';

const AddOrUpdate = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const { postData, invalidateQuery: invalidateSalaryQuery } = usePayrollSalary();

	const form = useRHF(MONTHLY_BULK_SALARY_SCHEMA, MONTHLY_BULK_SALARY_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'salary',
	});
	const [isLoading, setIsLoading] = useState(false);
	async function onSubmit(values: IMonthlyBulkSalary) {
		const created_at = getDateTime();
		const created_by = user?.uuid;

		// Create purchase entries
		const salary_entries = [...values.salary].map((item) => ({
			...item,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const salary_entries_promise = postData.mutateAsync({
			url: '/hr/salary-entry',
			newData: salary_entries,
			isOnCloseNeeded: false,
		});

		try {
			await Promise.all([salary_entries_promise])
				.then(() => form.reset(MONTHLY_BULK_SALARY_NULL))
				.then(() => {
					invalidateSalaryQuery(); // TODO: Update invalidate query
					navigate(`/payroll/salary`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	}

	// Delete Handler
	const handleRemove = (index: number) => {
		remove(index);
	};

	// Copy Handler

	const handleUploadFile = async (data: any[]) => {
		try {
			setIsLoading(true);
			data?.map((item) => {
				item.amount = Number(item.amount);
				item.month = Number(item.month);
				item.year = Number(item.year);
				item.type = item?.type?.toLowerCase();
			});
			form.setValue('salary', data, { shouldDirty: true });
			setIsLoading(false);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};
	return (
		<CoreForm.AddEditWrapper title={'Salary Bulk Upload'} form={form} onSubmit={onSubmit}>
			<CoreForm.DynamicFields
				title='Salary Bulk Upload'
				form={form}
				fieldName='salary'
				fieldDefs={useGenerateFieldDefs({
					remove: handleRemove,
					watch: form.watch,
					form,
				})}
				fields={fields}
				extraButton={
					<div className='flex items-center gap-4'>
						<ReadFile onChange={handleUploadFile} />
					</div>
				}
			></CoreForm.DynamicFields>
		</CoreForm.AddEditWrapper>
	);
};

export default AddOrUpdate;
