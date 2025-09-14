import { useEffect } from 'react';
import { IResponse } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import { useOtherGroup, useOtherProduct } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { IReviewTableData } from '../_config/columns/columns.type';
import { useStoreContactUsByUUID, useStoreReviewsByUUID } from '../_config/query';
import { REVIEW_NULL, REVIEW_SCHEMA } from '../_config/schema';
import { IReviewAddOrUpdateProps } from '../_config/types';
import { rating } from './utils';

const AddOrUpdate: React.FC<IReviewAddOrUpdateProps> = ({
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
	const { data } = useStoreReviewsByUUID<IReviewTableData>(updatedData?.uuid as string);
	const { data: productOptions } = useOtherProduct<IFormSelectOption[]>(updatedData?.uuid as string);
	const { invalidateQuery: invalidateGroup } = useOtherGroup<IFormSelectOption[]>();

	const form = useRHF(REVIEW_SCHEMA, REVIEW_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(REVIEW_NULL);
		setOpen((prev) => !prev);
		invalidateGroup();
	};

	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	// Submit handler
	async function onSubmit(values: IReviewTableData) {
		if (isUpdate) {
			// UPDATE ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.uuid}`,
				updatedData: {
					...values,
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
			title={isUpdate ? `Update ${updatedData?.product_title} Contact Us` : 'Add New Contact Us'}
			form={form}
			onSubmit={onSubmit}
		>
			<FormField
				control={form.control}
				name='product_uuid'
				render={(props) => <CoreForm.ReactSelect options={productOptions!} isDisabled={true} {...props} />}
			/>
			<FormField
				control={form.control}
				name='name'
				render={(props) => <CoreForm.Input disabled={true} {...props} />}
			/>
			<FormField
				control={form.control}
				name='rating'
				render={(props) => <CoreForm.Radio options={rating} {...props} />}
			/>
			<FormField control={form.control} name='comment' render={(props) => <CoreForm.Textarea {...props} />} />

			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</AddModal>
	);
};

export default AddOrUpdate;
