import { useEffect } from 'react';
import { ICustomUserType } from '@/pages/work/info/add-or-update/header';
import { platformTypeOptions } from '@/pages/work/info/add-or-update/utils';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import { useOtherBox, useOtherFloor, useOtherUserByQuery } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';

import { IAccessories } from '../_config/columns/columns.type';
import { useAccessoriesByUUID } from '../_config/query';
import { ACCESSORIES_NULL, ACCESSORIES_SCHEMA } from '../_config/schema';
import { IAccessoriesAddOrUpdateProps } from '../_config/types';

const AddOrUpdate: React.FC<IAccessoriesAddOrUpdateProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	imageUpdateData,
	imagePostData,
}) => {
	const isUpdate = !!updatedData;

	const { user } = useAuth();
	const { data } = useAccessoriesByUUID<IAccessories>(updatedData?.uuid as string);
	const { data: userOption } = useOtherUserByQuery<ICustomUserType[]>('?type=web');

	const form = useRHF(ACCESSORIES_SCHEMA, ACCESSORIES_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(ACCESSORIES_NULL);
		setOpen((prev) => !prev);
	};

	// Reset form values when data is updated
	useEffect(() => {
		if (data && isUpdate) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	// Submit handler
	async function onSubmit(values: IAccessories) {
		const formData = {
			...values,
			updated_at: getDateTime(),
		};

		// UPDATE ITEM
		imageUpdateData.mutateAsync({
			url: `${url}/${updatedData?.uuid}`,
			updatedData: formData,
			onClose,
		});
	}

	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={isUpdate ? `Update ${updatedData?.accessories_id} Accessories Order` : 'Add New Accessories'}
			form={form}
			isSmall={true}
			onSubmit={onSubmit}
		>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
				<FormField
					control={form.control}
					name='user_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							label='Customer'
							placeholder='Select Customer'
							options={userOption!}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='quantity'
					render={(props) => <CoreForm.Input type='number' {...props} />}
				/>
				<FormField
					control={form.control}
					name='where_they_find_us'
					render={(props) => (
						<CoreForm.ReactSelect
							label='Where They Find Us'
							options={platformTypeOptions || []}
							placeholder='Select Platform'
							{...props}
						/>
					)}
				/>

				<FormField
					control={form.control}
					name={`image_1`}
					render={(props) => (
						<CoreForm.FileUpload
							label='Image 1'
							className='h-full'
							fileType='image'
							isUpdate={isUpdate}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name={`image_2`}
					render={(props) => (
						<CoreForm.FileUpload
							label='Image 2'
							className='h-full'
							fileType='image'
							isUpdate={isUpdate}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name={`image_3`}
					render={(props) => (
						<CoreForm.FileUpload
							label='Image 3'
							className='h-full'
							fileType='image'
							isUpdate={isUpdate}
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={(props) => <CoreForm.Textarea {...props} />}
				/>
				<FormField
					control={form.control}
					name='location'
					render={(props) => <CoreForm.Textarea {...props} />}
				/>
				<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
			</div>
		</AddModal>
	);
};

export default AddOrUpdate;
