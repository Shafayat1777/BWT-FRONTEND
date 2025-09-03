import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';

import '@/lib/common-queries/other';

import { lazy, Suspense, useEffect, useState } from 'react';
import { useStoreProducts } from '@/pages/store/_config/query';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { IFormSelectOption } from '@/components/core/form/types';

import {
	useOtherProblem,
	useOtherPurchaseEntry,
	useOtherUserByQuery,
	useOtherWarehouse,
} from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';
import Formdata from '@/utils/formdata';

import { IOrderTableData } from '../_config/columns/columns.type';
import { useWorkChat, useWorkOrderByDetails, useWorkOrderByUUID, useWorkRepairing } from '../_config/query';
import { IRepair, MESSAGE_NULL, MESSAGE_SCHEMA, REPAIR_NULL, REPAIR_SCHEMA } from '../_config/schema';
import ChatInterface from '../../../components/others/message';
import { ICustomUserType } from '../info/add-or-update/header';
import { ICustomProductsSelectOption, ICustomWarehouseSelectOption } from '../order/details/transfer/utills';
import Information from './information';
import useGenerateFieldDefs from './useGenerateFieldDefs';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const AddOrUpdate = () => {
	const { user } = useAuth();
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;
	const navigate = useNavigate();
	const { data: userOption } = useOtherUserByQuery<ICustomUserType[]>('?type=customer');
	const { data: purchaseEntryOptions, invalidateQuery: invalidateQueryOtherProduct } = useOtherPurchaseEntry<
		ICustomProductsSelectOption[]
	>(`is_warehouse=true&&is_purchase_return_entry=false`);
	const { data: problemOption } = useOtherProblem<IFormSelectOption[]>('employee');
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

	const { data, postData, updateData, deleteData } = useWorkOrderByUUID<IOrderTableData>(uuid as string);
	const { data: orderData, invalidateQuery: invalidateQueryOrderByDetails } = useWorkOrderByDetails<IOrderTableData>(
		uuid as string
	);
	const { data: chatData, invalidateQuery: invalidateQueryChat, refetch } = useWorkChat<Message[]>(uuid as string);
	const { invalidateQuery: invalidateQueryOtherWarehouse } = useOtherWarehouse<ICustomWarehouseSelectOption[]>();
	const { invalidateQuery: invalidateQueryRepairing } = useWorkRepairing<IOrderTableData[]>();
	const { invalidateQuery: invalidateQueryProduct } = useStoreProducts<IFormSelectOption[]>();

	//* Form and Field Arrays
	const form = useRHF(REPAIR_SCHEMA, REPAIR_NULL);
	const messageForm = useRHF(MESSAGE_SCHEMA, MESSAGE_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'product_transfer',
	});
	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	const handleAdd = () => {
		append({
			purchase_entry_uuid: '',
			warehouse_uuid: '',
			remarks: '',
		});
	};

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Delete Handler
	const handleRemove = (index: number) => {
		const stock_id: string =
			String(
				purchaseEntryOptions?.find(
					(p) => p.value === form.getValues('product_transfer')[index].purchase_entry_uuid
				)?.label
			) || '';
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: stock_id,
			});
		} else {
			remove(index);
		}
	};
	const [deleteMessage, setDeleteMessage] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const handleDelete = (uuid: string) => {
		const message = chatData?.find((msg) => msg.uuid === uuid);
		setDeleteMessage({
			id: uuid,
			name: message?.message || 'Message',
		});
	};
	const felidDefs = useGenerateFieldDefs({
		remove: handleRemove,
		watch: form.watch,
		form,
		data,
		isUpdate,
	});
	interface Message {
		uuid: string;
		message: string;
		page: 'repair' | 'diagnosis';
		created_by_name?: string;
		order_uuid?: string;
		created_by?: string;
		created_at?: string;
		updated_at?: string | undefined;
	}

	const handleSend = async (editId?: string, editText?: string) => {
		try {
			const now = getDateTime();

			if (editId === undefined && messageForm.getValues('message')) {
				// Create new user message
				const userMsg: Message = {
					uuid: nanoid(),
					message: messageForm.getValues('message'),
					page: 'repair',
					order_uuid: uuid,
					created_by: user?.uuid,
					created_at: now,
					updated_at: undefined,
				};
				await postData.mutateAsync({
					url: '/work/chat',
					newData: userMsg,
					isOnCloseNeeded: false,
				});
				messageForm.reset(MESSAGE_NULL);
				invalidateQueryChat();
			} else {
				// Update existing message
				const updatedMsg: Message = {
					uuid: editId || '',
					message: editText || '',
					page: 'repair',
					order_uuid: uuid,
					created_by: user?.uuid,
					updated_at: now,
				};
				await updateData.mutateAsync({
					url: `/work/chat/${editId}`,
					updatedData: updatedMsg,
					isOnCloseNeeded: false,
				});
				invalidateQueryChat();
				setEditingMessageId(null);
			}
		} catch (error) {
			console.error(`${editId ? 'Update' : 'Create'} failed:`, error);
		}
	};
	// Submit handler
	async function onSubmit(values: IRepair) {
		const order_data = {
			...values,
			product_transfer: null,
			updated_at: getDateTime(),
			ready_for_delivery_date:
				data?.is_ready_for_delivery !== values.is_ready_for_delivery
					? values.is_ready_for_delivery
						? getDateTime()
						: null
					: data?.ready_for_delivery_date,
		};
		const formData = {
			...order_data,
		};
		// orderFields.forEach((field) => {
		// 	if (
		// 		order_data[field as keyof typeof values] == null ||
		// 		order_data[field as keyof typeof values] === '' ||
		// 		order_data[field as keyof typeof values] === undefined
		// 	) {
		// 		console.log('Null value found in form data', field, values[field as keyof typeof values]);
		// 		formData.delete(field);
		// 	}
		// });
		const order_promise = await updateData.mutateAsync({
			url: `/work/order-without-form/${uuid}`,
			updatedData: formData,
			isOnCloseNeeded: false,
		});

		const product_transfer_promise = values.product_transfer.map((item) => {
			if (item.uuid === undefined) {
				const newData = {
					...item,
					order_uuid: uuid,
					quantity: 1,
					created_at: getDateTime(),
					created_by: user?.uuid,
					uuid: nanoid(),
				};

				return postData.mutateAsync({
					url: '/store/product-transfer',
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
					url: `/store/product-transfer/${item.uuid}`,
					updatedData,
					isOnCloseNeeded: false,
				});
			}
		});

		try {
			await Promise.all([order_promise, ...product_transfer_promise])
				.then(() => form.reset(REPAIR_NULL))
				.then(() => {
					invalidateQueryOrderByDetails();
					invalidateQueryOtherProduct();
					invalidateQueryOtherWarehouse();
					invalidateQueryRepairing();
					invalidateQueryProduct();
					navigate(`/work/repairing`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}

		return;
	}

	return (
		<div className='gap-2'>
			<Information data={(orderData || []) as IOrderTableData} />
			<div className='grid grid-cols-2 gap-4'>
				<div className='gap-4'>
					<CoreForm.AddEditWrapper
						title={isUpdate ? 'Edit Repairing Order' : ' Add Repairing Order'}
						form={form}
						onSubmit={onSubmit}
					>
						<CoreForm.Section
							title={isUpdate ? 'Edit Repairing Order' : ' Add Repairing Order'}
							className='grid grid-cols-2 gap-4'
							extraHeader={
								<div className='flex gap-2 text-warning-foreground'>
									<FormField
										control={form.control}
										name='is_transferred_for_qc'
										render={(props) => (
											<CoreForm.Checkbox
												className='bg-warning-foreground'
												label='Transfer to QC'
												{...props}
											/>
										)}
									/>
									<FormField
										control={form.control}
										name='is_ready_for_delivery'
										render={(props) => (
											<CoreForm.Checkbox
												label='Ready for Delivery'
												className='bg-warning-foreground'
												{...props}
											/>
										)}
									/>
								</div>
							}
						>
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
							<FormField
								control={form.control}
								name='repairing_problems_uuid'
								render={(props) => (
									<CoreForm.ReactSelect
										isMulti
										label='Problems'
										menuPortalTarget={document.body}
										options={problemOption!}
										placeholder='Select Problems'
										{...props}
									/>
								)}
							/>

							<FormField
								control={form.control}
								name='repairing_problem_statement'
								render={(props) => <CoreForm.Textarea label='Problem Statement' {...props} />}
							/>
							<FormField
								control={form.control}
								name='remarks'
								render={(props) => <CoreForm.Textarea label='Remarks' className='flex-1' {...props} />}
							/>
						</CoreForm.Section>

						<CoreForm.DynamicFields
							title='Repairing Product Transfer'
							form={form}
							fieldName='product_transfer'
							fieldDefs={felidDefs}
							handleAdd={handleAdd}
							fields={fields}
						/>

						<Suspense fallback={null}>
							<DeleteModal
								{...{
									deleteItem,
									setDeleteItem,
									url: `/store/product-transfer`,
									deleteData,
									onClose: () => {
										form.setValue(
											'product_transfer',
											form
												.getValues('product_transfer')
												.filter((item) => item.uuid !== deleteItem?.id)
										);
									},
									needRefresh: true,
								}}
							/>
							<DeleteModal
								{...{
									deleteItem: deleteMessage,
									setDeleteItem: setDeleteMessage,
									url: `/work/chat`,
									deleteData,

									invalidateQueries: invalidateQueryChat,
								}}
							/>
						</Suspense>
					</CoreForm.AddEditWrapper>
				</div>
				<ChatInterface
					handleSend={handleSend}
					form={messageForm}
					data={chatData || []}
					title='Chat With Repairing'
					subTitle={`${data?.order_id}`}
					page='repair'
					deleteMessage={handleDelete}
					refetch={refetch}
					editingMessageId={editingMessageId}
					setEditingMessageId={setEditingMessageId}
				/>
			</div>
		</div>
	);
};

export default AddOrUpdate;
