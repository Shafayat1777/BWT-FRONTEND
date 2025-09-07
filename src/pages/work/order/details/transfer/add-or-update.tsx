import { useEffect } from 'react';
import { IDefaultAddOrUpdateProps } from '@/types';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import { useOtherPurchaseEntry, useOtherWarehouse } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { IOrderTableData, IStockActionTrx, ITransferTableData } from '../../../_config/columns/columns.type';
import { useStoreOrderTransfersByUUID, useWorkOrderByDetails } from '../../../_config/query';
import { TRANSFER_NULL, TRANSFER_SCHEMA } from '../../../_config/schema';
import { ICustomPurchaseEntrySelectOption, ICustomWarehouseSelectOption } from './utills';

interface ITrxProps extends IDefaultAddOrUpdateProps {
	updatedData?: IStockActionTrx | null;
	order_uuid?: string;
}

const Trx: React.FC<ITrxProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	updateData,
	postData,
	order_uuid,
}) => {
	const isUpdate = !!updatedData;

	const { data } = useStoreOrderTransfersByUUID<ITransferTableData>(updatedData?.uuid as string);
	const { data: purchaseEntryOptions, invalidateQuery: invalidateQueryOtherProduct } = useOtherPurchaseEntry<
		ICustomPurchaseEntrySelectOption[]
	>(`is_warehouse=true&is_purchase_return_entry=false`);
	const { data: warehouseOptions, invalidateQuery: invalidateQueryOtherWarehouse } =
		useOtherWarehouse<ICustomWarehouseSelectOption[]>();
	const { invalidateQuery: invalidateQueryOrderByDetails } = useWorkOrderByDetails<IOrderTableData>(
		order_uuid as string
	);

	const { user } = useAuth();
	const form = useRHF(TRANSFER_SCHEMA, TRANSFER_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(TRANSFER_NULL);
		setOpen((prev) => !prev);
		invalidateQueryOrderByDetails();
		invalidateQueryOtherProduct();
		invalidateQueryOtherWarehouse();
	};
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);
	// Submit handler
	async function onSubmit(values: IStockActionTrx) {
		const warehouse_uuid = purchaseEntryOptions?.find(
			(option) => option.value === values.purchase_entry_uuid
		)?.warehouse_uuid;
		if (isUpdate) {
			// ADD NEW ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.uuid}`,
				updatedData: {
					...values,
					warehouse_uuid: warehouse_uuid,
					quantity: 1,
					order_uuid: order_uuid,
					created_at: getDateTime(),
					created_by: user?.uuid,
					uuid: nanoid(),
				},
				onClose,
			});
		} else {
			await postData.mutateAsync({
				url,
				newData: {
					...values,
					warehouse_uuid: warehouse_uuid,
					quantity: 1,
					order_uuid: order_uuid,
					created_at: getDateTime(),
					created_by: user?.uuid,
					uuid: nanoid(),
				},
				onClose,
			});
		}
	}

	return (
		<AddModal open={open} setOpen={onClose} title={'Transfer Material'} form={form} onSubmit={onSubmit}>
			<FormField
				control={form.control}
				name='purchase_entry_uuid'
				render={(props) => (
					<CoreForm.ReactSelect
						label='Purchase Entry'
						placeholder='Select Purchase'
						isDisabled={isUpdate}
						options={purchaseEntryOptions!}
						{...props}
					/>
				)}
			/>
			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</AddModal>
	);
};

export default Trx;
