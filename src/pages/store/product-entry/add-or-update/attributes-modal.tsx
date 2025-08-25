import { Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

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
	const isUpdate = !!updatedData?.uuid;

	const { fields, replace, remove, append } = useFieldArray({
		control: form.control,
		name: `product_variant.${updatedData?.index || 0}.product_variant_values_entry`,
	});

	const onClose = () => {
		setUpdatedData?.(null);
		setOpen((prev) => !prev);

		form.watch(`product_variant.${updatedData?.index || 0}.product_variant_values_entry`).forEach((field, index) => {
			if (!field.attribute_uuid && !field.value) {
				remove(index);
			}
		});
	};

	// // set form values if it's an update
	// useEffect(() => {
	// 	if (isUpdate) {
	// 		const existingSerials = form.getValues(
	// 			`product_variant.${updatedData.index || 0}.product_variant_values_entry`
	// 		);
	// 		const newSerials = Array.from({ length: updatedData.quantity }, (_, i) => ({
	// 			...existingSerials[i],
	// 			index: i + 1,
	// 		}));
	// 		replace(newSerials);
	// 	}
	// }, [isUpdate, updatedData, replace, form]);

	// useEffect(() => {
	// 	if (updatedData && !isUpdate) {
	// 		// If it's a new entry, we need to create an array of serials based on the quantity
	// 		if (form.getValues(`product_variant.${updatedData.index || 0}.product_variant_values_entry`).length === 0) {
	// 			const newSerials = Array.from({ length: updatedData.quantity }, (_, i) => ({
	// 				index: i + 1,
	// 				serial: '',
	// 			}));
	// 			replace(newSerials); // replaces the product_variant_values_entry array entirely
	// 		} else {
	// 			const existingSerials = form.getValues(
	// 				`product_variant.${updatedData.index || 0}.product_variant_values_entry`
	// 			);
	// 			const newSerials = Array.from({ length: updatedData.quantity }, (_, i) => ({
	// 				...existingSerials[i],
	// 				index: i + 1,
	// 			}));
	// 			replace(newSerials);
	// 		}
	// 	}
	// }, [updatedData, isUpdate, replace, form]);

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
		if (fields[index].uuid) {
			setDeleteItem({
				id: fields[index].uuid,
				name: fields[index].uuid,
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
						title={isUpdate ? 'Update Attribute' : 'Add Attribute'}
						form={form}
						fieldName={`product_variant.${updatedData?.index}.product_variant_values_entry`}
						fieldDefs={useGenerateAttribute({
							form: form,
							remove: handleRemove,
							isUpdate,
							updatedData,
						})}
						fields={fields}
						handleAdd={handleAdd}
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
								`product_variant.${updatedData?.index || 0}.product_variant_values_entry`,
								form
									.getValues(
										`product_variant.${updatedData?.index || 0}.product_variant_values_entry`
									)
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
