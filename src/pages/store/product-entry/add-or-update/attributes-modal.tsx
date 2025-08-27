import { watch } from 'fs';
import { Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import CoreForm from '@core/form';
import { AddModal, DeleteModal, DetailsModal } from '@core/modal';

import { IAttributeAddOrUpdateProps } from '../../_config/types';
import useGenerateAttribute from './useGenerateAttribute';

const AddOrUpdate: React.FC<IAttributeAddOrUpdateProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	postData,
	updateData,
	deleteData,
	form,
}) => {
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;
	const variant_index = updatedData?.index ?? 0;

	const { fields, replace, remove, append } = useFieldArray({
		control: form.control,
		name: `product_variant.${variant_index}.product_variant_values_entry`,
	});

	const onClose = () => {
		setUpdatedData?.(null);
		setOpen((prev) => !prev);

		// Get the current array length to iterate backward
		const watchedEntries = form.watch(`product_variant.${variant_index}.product_variant_values_entry`);

		for (let i = watchedEntries.length - 1; i >= 0; i--) {
			const field = watchedEntries[i];

			// Check if both fields are "empty"
			if (!field.attribute_uuid && !field.value) {
				remove(i);
			}
		}
	};

	useEffect(() => {
		if (!isUpdate) {
			const newEntry = form
				.watch('attribute_list')
				.filter((item: string | undefined): item is string => typeof item === 'string')
				.map((item) => ({
					attribute_uuid: item,
					value:
						form
							.watch(`product_variant.${variant_index}.product_variant_values_entry`)
							?.find((field) => field.attribute_uuid === item)?.value || '',
				}));

			replace(newEntry);
		}

		if (isUpdate && form.watch(`product_variant.${variant_index}.product_variant_values_entry`)?.length === 0) {
			const newEntry = form
				.watch('attribute_list')
				.filter((item: string | undefined): item is string => typeof item === 'string')
				.map((item) => ({
					attribute_uuid: item,
					value:
						form
							.watch(`product_variant.${variant_index}.product_variant_values_entry`)
							?.find((field) => field.attribute_uuid === item)?.value || '',
				}));

			append(newEntry);
		}
	}, [form.watch('attribute_list'), replace, form, variant_index, isUpdate]);

	

	const handleAdd = () => {
		append({
			product_variant_uuid: '',
			attribute_uuid: '',
			value: '',
		});
	};

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const handleRemove = (index: number) => {
		const item = form.watch(`product_variant.${variant_index}.product_variant_values_entry`)[index];
		if (item.uuid) {
			setDeleteItem({
				id: item.uuid,
				name: item.uuid,
			});
		} else {
			remove(index);
		}
	};

	return (
		<>
			<DetailsModal
				isSmall
				open={open}
				setOpen={onClose}
				// title={isUpdate ? 'Update Attribute' : 'Add Attribute'}
				content={
					<CoreForm.DynamicFields
						title={
							isUpdate
								? `Update Variant ${variant_index + 1} Attribute`
								: `Add Variant ${variant_index + 1} Attribute`
						}
						form={form}
						fieldName={`product_variant.${variant_index}.product_variant_values_entry`}
						fieldDefs={useGenerateAttribute({
							form: form,
							remove: handleRemove,
							isUpdate,
							updatedData,
						})}
						fields={fields}
						// handleAdd={handleAdd}
					/>
				}
			/>
			<Suspense fallback={null}>
				<DeleteModal
					{...{
						deleteItem,
						setDeleteItem,
						url: `/store/product-variant-values-entry`,
						deleteData,
						onClose: () => {
							form.setValue(
								`product_variant.${variant_index}.product_variant_values_entry`,
								form
									.getValues(`product_variant.${variant_index}.product_variant_values_entry`)
									.filter((item) => item.uuid !== deleteItem?.id)
							);
						},
					}}
				/>
			</Suspense>
		</>
	);
};

export default AddOrUpdate;
