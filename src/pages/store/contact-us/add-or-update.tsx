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

import { useOtherGroup } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { IContactUsTableData } from '../_config/columns/columns.type';
import { useStoreContactUsByUUID } from '../_config/query';
import { CONTACT_US_NULL, CONTACT_US_SCHEMA } from '../_config/schema';
import { IContactUsAddOrUpdateProps } from '../_config/types';

const AddOrUpdate: React.FC<IContactUsAddOrUpdateProps> = ({
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
	const { data } = useStoreContactUsByUUID<IContactUsTableData>(updatedData?.id as number);
	const { invalidateQuery: invalidateGroup } = useOtherGroup<IFormSelectOption[]>();

	const form = useRHF(CONTACT_US_SCHEMA, CONTACT_US_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(CONTACT_US_NULL);
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
	async function onSubmit(values: IContactUsTableData) {
		if (isUpdate) {
			// UPDATE ITEM
			updateData.mutateAsync({
				url: `${url}/${updatedData?.id}`,
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
			title={isUpdate ? `Update ${updatedData?.name} Contact Us` : 'Add New Contact Us'}
			form={form}
			onSubmit={onSubmit}
		>
			<FormField control={form.control} name='name' render={(props) => <CoreForm.Input {...props} />} />
			<FormField control={form.control} name='phone' render={(props) => <CoreForm.Phone {...props} />} />
			<FormField control={form.control} name='subject' render={(props) => <CoreForm.Input {...props} />} />
			<FormField control={form.control} name='message' render={(props) => <CoreForm.Textarea {...props} />} />
			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</AddModal>
	);
};

export default AddOrUpdate;
