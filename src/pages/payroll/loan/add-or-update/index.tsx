import { lazy, Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';



import { ShowLocalToast } from '@/components/others/toast';
import CoreForm from '@core/form';



import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';



import { usePayrollLoan, usePayrollLoanByUUID } from '../../_config/query';
import { ILoan, LOAN_NULL, LOAN_SCHEMA } from '../../_config/schema';
import Header from './header';
import useGenerateFieldDefs from './useGenerateFieldDefs';


const DeleteModal = lazy(() => import('@core/modal/delete'));

const AddOrUpdate = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;

	const { url: purchaseUrl, updateData, postData, deleteData } = usePayrollLoan();

	const { data, invalidateQuery: invalidateTestDetails } = usePayrollLoanByUUID(uuid as string);

	const form = useRHF(LOAN_SCHEMA, LOAN_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'loan_entry',
	});

	useEffect(() => {
		if (isUpdate && data) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	async function onSubmit(values: ILoan) {
		/* -------------------------------------------------------------------------- */
		/*                                 UPDATE TEST                                */
		/* -------------------------------------------------------------------------- */
		if (values.loan_entry.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Please add at least one entry',
			});
			return;
		}
		if (isUpdate) {
			const purchase_data = {
				...values,
				updated_at: getDateTime(),
			};

			const test_promise = await updateData.mutateAsync({
				url: `${purchaseUrl}/${uuid}`,
				updatedData: purchase_data,
				isOnCloseNeeded: false,
			});

			const loan_entry_promise = values.loan_entry.map((item) => {
				if (item.uuid === undefined) {
					const newData = {
						...item,
						quantity: 1,
						loan_uuid: uuid,
						created_at: getDateTime(),
						created_by: user?.uuid,
						uuid: nanoid(),
					};

					return postData.mutateAsync({
						url: '/hr/loan-entry',
						newData: newData,
						isOnCloseNeeded: false,
					});
				} else {
					const updatedData = {
						...item,
						quantity: 1,
						updated_at: getDateTime(),
					};
					return updateData.mutateAsync({
						url: `/hr/loan-entry/${item.uuid}`,
						updatedData,
						isOnCloseNeeded: false,
					});
				}
			});

			try {
				await Promise.all([test_promise, ...loan_entry_promise])
					.then(() => form.reset(LOAN_NULL))
					.then(() => {
						invalidateTestDetails(); // TODO: Update invalidate query
						navigate(`/payroll/loan`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		const new_loan_uuid = nanoid();
		const created_at = getDateTime();
		const created_by = user?.uuid;

		// Create purchase description

		const purchase_data = {
			...values,
			uuid: new_loan_uuid,
			created_at,
			created_by,
		};

		// delete purchase field from data to be sent

		if ('loan_entry' in purchase_data) {
			delete (purchase_data as { loan_entry?: any })['loan_entry'];
		}

		// TODO: Update url and variable name ⬇️
		const purchase_promise = await postData.mutateAsync({
			url: purchaseUrl,
			newData: purchase_data,
			isOnCloseNeeded: false,
		});

		// Create purchase entries
		const loan_entry_entries = [...values.loan_entry].map((item) => ({
			...item,
			quantity: 1,
			loan_uuid: new_loan_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const loan_entry_entries_promise = loan_entry_entries.map((item) =>
			postData.mutateAsync({
				url: '/hr/loan-entry',
				newData: item,
				isOnCloseNeeded: false,
			})
		);

		try {
			await Promise.all([purchase_promise, ...loan_entry_entries_promise])
				.then(() => form.reset(LOAN_NULL))
				.then(() => {
					invalidateTestDetails(); // TODO: Update invalidate query
					navigate(`/payroll/loan`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	}

	const handleAdd = () => {
		append({
			type: 'partial',
			amount: 0,
			remarks: '',
			date: getDateTime(),
		});
	};

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Delete Handler
	const handleRemove = (index: number) => {
		const stock_id: string = String(form.getValues('loan_entry')[index].amount);
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: stock_id,
			});
		} else {
			remove(index);
		}
	};

	// Copy Handler
	const handleCopy = (index: number) => {
		// TODO: Update fields ⬇️
		const field = form.watch('loan_entry')[index];
		append({
			type: field.type,
			amount: field.amount,
			remarks: field.remarks,
			date: field.date,
		});
	};
	const total = form.watch('loan_entry')?.reduce(
		(acc, curr) => {
			acc.total_price += Number(curr.amount);

			return acc;
		},
		{
			total_price: 0,
		}
	);
	return (
		<CoreForm.AddEditWrapper
			title={isUpdate ? 'Edit Loan Entry' : ' Add Loan Entry'}
			form={form}
			onSubmit={onSubmit}
		>
			<Header />
			<CoreForm.DynamicFields
				title='Loan Pay Entry'
				form={form}
				fieldName='loan_entry'
				fieldDefs={useGenerateFieldDefs({
					copy: handleCopy,
					remove: handleRemove,
					watch: form.watch,
					form,
				})}
				handleAdd={handleAdd}
				fields={fields}
			>
				<tr>
					<td className='border-t text-right font-semibold' colSpan={1}>
						Grand Total:
					</td>

					<td className='border-t px-3 py-2' colSpan={1}>
						{total.total_price}
					</td>
					<td className='border-t text-right font-semibold' colSpan={1}>
						Remaining:
					</td>

					<td className='border-t px-3 py-2' colSpan={5}>
						{form.watch('amount') - total.total_price}
					</td>
				</tr>
			</CoreForm.DynamicFields>

			<Suspense fallback={null}>
				<DeleteModal
					{...{
						deleteItem,
						setDeleteItem,
						url: `/hr/loan-entry`,
						deleteData,
						onClose: () => {
							form.setValue(
								'loan_entry',
								form.getValues('loan_entry').filter((item) => item.uuid !== deleteItem?.id)
							);
						},
					}}
				/>
			</Suspense>
		</CoreForm.AddEditWrapper>
	);
};

export default AddOrUpdate;