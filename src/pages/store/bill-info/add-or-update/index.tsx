import { lazy, Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { ShowLocalToast } from '@/components/others/toast';
import CoreForm from '@core/form';

import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { useStoreBillInfo, useStoreBillInfoByUUID } from '../../_config/query';
import { BILL_INFO_NULL, BILL_INFO_SCHEMA, IBillInfo } from '../../_config/schema';
import { flattenOrderData } from '../utills';
import Header from './header';
import useGenerateFieldDefs from './useGenerateFieldDefs';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const AddOrUpdate = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;

	const { url: purchaseUrl, updateData, postData, deleteData } = useStoreBillInfo();

	const { data, invalidateQuery: invalidateTestDetails } = useStoreBillInfoByUUID(uuid as string);

	const form = useRHF(BILL_INFO_SCHEMA, BILL_INFO_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'order_details',
	});

	useEffect(() => {
		if (isUpdate && data) {
			flattenOrderData(data as IBillInfo);
			form.reset(flattenOrderData(data as IBillInfo).flattened);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);


	async function onSubmit(values: IBillInfo) {
		/* -------------------------------------------------------------------------- */
		/*                                 UPDATE TEST                                */
		/* -------------------------------------------------------------------------- */
		if (values.order_details.length === 0) {
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
			const { ship_address } = values;
			let ship_address_promise;
			if (ship_address) {
				if (ship_address.uuid) {
					ship_address_promise = updateData.mutateAsync({
						url: `/store/ship-address/${ship_address.uuid}`,
						updatedData: {
							...ship_address,
							bill_info_uuid: uuid,
							updated_at: getDateTime(),
						},
						isOnCloseNeeded: false,
					});
				} else {
					ship_address_promise = postData.mutateAsync({
						url: '/store/ship-address',
						newData: {
							...ship_address,
							bill_info_uuid: uuid,
							created_at: getDateTime(),
							created_by: user?.uuid,
							uuid: nanoid(),
						},
						isOnCloseNeeded: false,
					});
				}
			}
			const order_details_promise = values.order_details.map((item) => {
				if (item.uuid === undefined) {
					const newData = {
						...item,
						bill_info_uuid: uuid,
						created_at: getDateTime(),
						created_by: user?.uuid,
						uuid: nanoid(),
					};

					return postData.mutateAsync({
						url: '/store/ordered',
						newData: newData,
						isOnCloseNeeded: false,
					});
				} else {
					const updatedData = {
						...item,
						updated_at: getDateTime(),
					};
					return updateData.mutateAsync({
						url: `/store/ordered/${item.uuid}`,
						updatedData,
						isOnCloseNeeded: false,
					});
				}
			});

			try {
				await Promise.all([test_promise, ship_address_promise, ...order_details_promise])
					.then(() => form.reset(BILL_INFO_NULL))
					.then(() => {
						invalidateTestDetails(); // TODO: Update invalidate query
						navigate(`/store/product-order/${uuid}/details`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}
	}

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Delete Handler
	const handleRemove = (index: number) => {
		const stock_id: string = String(form.getValues('order_details')[index].product_variants_name);
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: stock_id,
			});
		} else {
			remove(index);
		}
	};

	const total = form.getValues()?.order_details.reduce(
		(acc, curr) => {
			acc.total_selling_price += curr.selling_price * curr.quantity;

			return acc;
		},
		{
			total_selling_price: 0,
		}
	);
	return (
		<CoreForm.AddEditWrapper title={isUpdate ? 'Edit Bill Info' : ' Add Bill Info'} form={form} onSubmit={onSubmit}>
			<Header />

			<CoreForm.DynamicFields
				title={`${isUpdate ? 'Edit Order' : ' Add Order'}`}
				form={form}
				fieldName='order_details'
				fieldDefs={useGenerateFieldDefs({
					remove: handleRemove,
					watch: form.watch,
					form,
					dynamicColumns: flattenOrderData(data as IBillInfo)?.columnNames,
				})}
				fields={fields}
			>
				<tr>
					<td
						className='border-t text-right font-semibold'
						colSpan={4 + flattenOrderData(data as IBillInfo)?.columnNames.length - 1}
					>
						Grand Total:
					</td>

					<td className='border-t px-3 py-2' colSpan={5}>
						{total.total_selling_price}
					</td>
				</tr>
			</CoreForm.DynamicFields>

			<Suspense fallback={null}>
				<DeleteModal
					{...{
						deleteItem,
						setDeleteItem,
						url: `/store/ordered`,
						deleteData,
						onClose: () => {
							form.setValue(
								'order_details',
								form.getValues('order_details').filter((item) => item.uuid !== deleteItem?.id)
							);
						},
					}}
				/>
			</Suspense>
		</CoreForm.AddEditWrapper>
	);
};

export default AddOrUpdate;
