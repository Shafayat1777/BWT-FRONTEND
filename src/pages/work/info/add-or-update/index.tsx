import { receiveMessageOnPort } from 'worker_threads';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { ShowLocalToast } from '@/components/others/toast';
import ReactSelect from '@/components/ui/react-select';
import CoreForm from '@core/form';

import { useOtherUserByQuery } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';
import Formdata from '@/utils/formdata';

import { IInfoTableData } from '../../_config/columns/columns.type';
import { useWorkInfo, useWorkInfoByUUID } from '../../_config/query';
import { IInfo, INFO_NULL, INFO_SCHEMA } from '../../_config/schema';
import { orderFields } from '../../order/utill';
import Header from './header';
import useGenerateFieldDefs from './useGenerateFieldDefs';
import useGenerateFieldDefsV2 from './useGenerateFieldDefsV2';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const AddOrUpdate = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;

	const { url: infoUrl, updateData, postData, imagePostData, imageUpdateData, deleteData } = useWorkInfo();
	const { invalidateQuery: invalidateCustomer } = useOtherUserByQuery<IFormSelectOption[]>('?type=customer');
	const { invalidateQuery: invalidateWorkInfo } = useWorkInfo<IInfoTableData[]>(`status=pending`);
	const { data, invalidateQuery: invalidateTestDetails } = useWorkInfoByUUID<IInfo>(uuid as string, isUpdate);
	const { invalidateQuery: invalidateInfoDetails } = useWorkInfoByUUID<IInfo>(uuid as string);

	const form = useRHF(INFO_SCHEMA, INFO_NULL);
	const isProductReceived = form.watch('is_product_received');
	const isNewCustomer = form.watch('is_new_customer');
	const isBusinessTypeCompany = form.watch('business_type') === 'company' && isNewCustomer;

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'order_entry',
	});

	useEffect(() => {
		if (isUpdate && data) {
			form.reset({
				...data,
				order_entry: Array.isArray(data.order_entry)
					? data.order_entry
					: data.order_entry
						? [data.order_entry]
						: [],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	async function onSubmit(values: IInfo) {
		/* -------------------------------------------------------------------------- */
		/*                                 UPDATE TEST                                */
		/* -------------------------------------------------------------------------- */

		if (isProductReceived && values.order_entry.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Please add at least one order entry',
			});
			return;
		}
		if (isUpdate) {
			const infoData = {
				...values,
				...(isNewCustomer && { user_uuid: nanoid() }),
				...(!isBusinessTypeCompany && { department_uuid: null, designation_uuid: null }),
				received_by:
					data?.is_product_received == values?.is_product_received
						? data?.received_by
						: values?.is_product_received
							? user?.uuid
							: null,
				updated_at: getDateTime(),
			};
			if ('order_entry' in infoData) {
				delete (infoData as { order_entry?: any })['order_entry'];
			}

			const info_promise = await updateData.mutateAsync({
				url: `${infoUrl}/${uuid}`,
				updatedData: infoData,
				isOnCloseNeeded: false,
			});

			const order_entry_promise = values.order_entry.map((item, index) => {
				if (item.uuid === undefined) {
					const newData = {
						...item,
						info_uuid: uuid,
						created_at: getDateTime(),
						created_by: user?.uuid,
						uuid: nanoid(),
					};
					const formData = Formdata({ ...newData, proposed_cost: 0 });
					orderFields.forEach((field) => {
						if (newData[field as keyof typeof values] == null) {
							formData?.set(field, '');
						}
					});

					return imagePostData.mutateAsync({
						url: '/work/order',
						newData: formData,
						isOnCloseNeeded: false,
					});
				} else {
					const updatedData = {
						...item,

						updated_at: getDateTime(),
					};
					const formData = Formdata(updatedData);

					orderFields.forEach((field) => {
						if (item[field as keyof typeof values] == null || item[field as keyof typeof values] === 0) {
							formData.delete(field);
						}
					});

					return imageUpdateData.mutateAsync({
						url: `/work/order/${item.uuid}`,
						updatedData: formData,
						isOnCloseNeeded: false,
					});
				}
			});

			try {
				await Promise.all([info_promise, ...order_entry_promise])
					.then(() => form.reset(INFO_NULL))
					.then(async () => {
						await invalidateCustomer();
						await invalidateTestDetails();
						await invalidateTestDetails();
						await invalidateWorkInfo();
						await invalidateInfoDetails();
						navigate(`/work/info/details/${uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		const info_uuid = nanoid();
		const created_at = getDateTime();
		const created_by = user?.uuid;

		// Create purchase description

		const infoData = {
			...values,
			...(isNewCustomer && { user_uuid: nanoid() }),
			...(!isBusinessTypeCompany && { department_uuid: null, designation_uuid: null }),
			received_by: values?.is_product_received ? user?.uuid : null,
			uuid: info_uuid,
			submitted_by: 'employee',
			created_at,
			created_by,
		};

		// delete purchase field from data to be sent

		if ('order_entry' in infoData) {
			delete (infoData as { order_entry?: any })['order_entry'];
		}

		const info_promise = await postData.mutateAsync({
			url: infoUrl,
			newData: infoData,
			isOnCloseNeeded: false,
		});

		// Create purchase entries
		const order_entry_entries = [...values.order_entry].map((item) => ({
			...item,
			info_uuid: info_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const order_entry_entries_promise = order_entry_entries.map((item) => {
			const formData = Formdata({ ...item, proposed_cost: 0 });

			orderFields.forEach((field) => {
				if (item[field as keyof typeof values] == null || item[field as keyof typeof values] === 0) {
					formData.delete(field);
				}
			});

			return imagePostData.mutateAsync({
				url: '/work/order',
				newData: formData,
				isOnCloseNeeded: false,
			});
		});

		try {
			// TODO: Update promises name ⬇️
			await Promise.all([info_promise, ...order_entry_entries_promise])
				.then(() => form.reset(INFO_NULL))
				.then(() => {
					invalidateCustomer();
					invalidateTestDetails();
					invalidateWorkInfo();
					navigate(`/work/info/details/${info_uuid}`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	}

	const handleAdd = () => {
		append({
			is_diagnosis_need: false,
			model_uuid: '',
			size_uuid: '',
			quantity: 1,
			serial_no: '',
			problems_uuid: [],
			problem_statement: '',
			accessories: [],
			warehouse_uuid: null,
			rack_uuid: null,
			floor_uuid: null,
			box_uuid: null,
			remarks: null,
			reclaimed_order_uuid: null,
			reclaimed_order_id: null,
		});
	};

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Delete Handler
	const handleRemove = (index: number) => {
		const modelName: string = String(form.getValues('order_entry')[index].model_name);
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: fields[index].brand_name + '(' + modelName + ')',
			});
		} else {
			remove(index);
		}
	};

	// Copy Handler
	const handleCopy = (index: number) => {
		const field = form.watch('order_entry')[index];
		append({
			is_diagnosis_need: field.is_diagnosis_need,
			brand_uuid: field.brand_uuid,
			model_uuid: field.model_uuid,
			serial_no: field.serial_no,
			quantity: field.quantity,
			accessories: field.accessories,
			warehouse_uuid: field.warehouse_uuid,
			rack_uuid: field.rack_uuid,
			floor_uuid: field.floor_uuid,
			box_uuid: field.box_uuid,
			remarks: field.remarks,
			reclaimed_order_uuid: '',
			reclaimed_order_id: '',
		});
	};
	const handleReclaimed = (index: number, isReclaimed: boolean) => {
		const field = form.watch('order_entry')[index];
		if (isReclaimed) {
			append({
				is_diagnosis_need: field.is_diagnosis_need,
				brand_uuid: field.brand_uuid,
				model_uuid: field.model_uuid,
				serial_no: field.serial_no,
				quantity: field.quantity,
				problems_uuid: field.problems_uuid,
				problem_statement: field.problem_statement,
				accessories: field.accessories,
				warehouse_uuid: field.warehouse_uuid,
				rack_uuid: field.rack_uuid,
				floor_uuid: field.floor_uuid,
				box_uuid: field.box_uuid,
				remarks: 'Reclaimed',
				reclaimed_order_uuid: field.uuid,
				reclaimed_order_id: field.order_id,
			});
		} else {
			const removeIdx = fields.findIndex((item) => item.reclaimed_order_uuid === field.uuid);
			handleRemove(removeIdx);
		}
	};
	//!Remove it when Version confirm
	const [version, setVersion] = useState(2);
	const fieldDefs = useGenerateFieldDefs({
		copy: handleCopy,
		remove: handleRemove,
		watch: form.watch,
		form: form,
		isProductReceived: isProductReceived,
		isUpdate: isUpdate,
		handleReclaimed: handleReclaimed,
	});
	const fieldDefsV2 = useGenerateFieldDefsV2({
		copy: handleCopy,
		remove: handleRemove,
		watch: form.watch,
		form: form,
		isProductReceived: isProductReceived,
		isUpdate: isUpdate,
	});
	return (
		<CoreForm.AddEditWrapper
			title={isUpdate ? 'Edit Order Entry' : ' Add Order Entry'}
			form={form}
			onSubmit={onSubmit}
		>
			<Header isUpdate={isUpdate} data={data} />
			{version === 1 && (
				<CoreForm.DynamicFields
					title={
						<div className='flex gap-2'>
							<h1 className='flex-1'>Order Entry</h1>
							<ReactSelect
								name='version'
								options={[
									{ label: 'Version 1', value: 1 },
									{ label: 'Version 2', value: 2 },
								]}
								value={[
									{ label: 'Version 1', value: 1 },
									{ label: 'Version 2', value: 2 },
								].find((item) => item.value === version)}
								onChange={(e: any) => setVersion(Number(e?.value))}
								isClearable={false}
							/>
						</div>
					}
					form={form}
					fieldName='order_entry'
					fieldDefs={fieldDefsV2}
					handleAdd={handleAdd}
					fields={fields}
				/>
			)}
			{version === 2 && (
				<CoreForm.DynamicFields
					viewAs='kanban'
					title={
						<div className='flex gap-2'>
							<h1 className='flex-1'>Order Entry</h1>
							<ReactSelect
								name='version'
								options={[
									{ label: 'Version 1', value: 1 },
									{ label: 'Version 2', value: 2 },
								]}
								value={[
									{ label: 'Version 1', value: 1 },
									{ label: 'Version 2', value: 2 },
								].find((item) => item.value === version)}
								onChange={(e: any) => setVersion(Number(e?.value))}
								isClearable={false}
							/>
						</div>
					}
					form={form}
					fieldName='order_entry'
					fieldDefs={fieldDefs}
					handleAdd={handleAdd}
					fields={fields}
				/>
			)}
			<Suspense fallback={null}>
				<DeleteModal
					{...{
						deleteItem,
						setDeleteItem,
						url: `/work/order`,
						deleteData,
						onClose: () => {
							form.setValue(
								'order_entry',
								form.getValues('order_entry').filter((item) => item.uuid !== deleteItem?.id)
							);
						},
					}}
				/>
			</Suspense>
		</CoreForm.AddEditWrapper>
	);
};

export default AddOrUpdate;
