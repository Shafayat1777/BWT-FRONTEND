import { lazy, Suspense, useEffect, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { IFormSelectOption } from '@/components/core/form/types';
import { ShowLocalToast } from '@/components/others/toast';
import CoreForm from '@core/form';

import { useOtherAttributes } from '@/lib/common-queries/other';
import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';
import Formdata from '@/utils/formdata';

import { useStoreProducts, useStoreProductsByUUID } from '../../_config/query';
import { IProductEntryV2, PRODUCT_ENTRY_NULL_V2, PRODUCT_ENTRY_SCHEMA_V2 } from '../../_config/schema';
import { flattenOrderData, normalizeOrderData } from '../utills';
import Header from './header';
import useGenerateSpecification from './useGenerateSpecification';
import useGenerateFieldDefs from './useGenerateVariant';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const Index = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { uuid } = useParams();
	const isUpdate: boolean = !!uuid;
	const {
		data,
		invalidateQuery: invalidateProductByUUID,
		updateData,
		postData,
		imagePostData,
		imageUpdateData,
		deleteData,
	} = useStoreProductsByUUID(uuid as string);
	const { invalidateQuery: invalidateProduct } = useStoreProducts();
	const { data: AttributeOptions } = useOtherAttributes<IFormSelectOption[]>();

	const form = useRHF(PRODUCT_ENTRY_SCHEMA_V2, PRODUCT_ENTRY_NULL_V2);

	const {
		fields: variantFields,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control: form.control,
		name: 'product_variant',
	});

	const {
		fields: specificationFields,
		append: appendSpecification,
		remove: removeSpecification,
	} = useFieldArray({
		control: form.control,
		name: 'product_specification',
	});
	const attributeList = AttributeOptions?.filter((item) =>
		form.watch('attribute_list').includes(item.value as string)
	);
	const columnNames = attributeList?.map((item) => item.label) || [];

	useEffect(() => {
		if (isUpdate && data) {
			form.reset(flattenOrderData(data).flattened);
		}
	}, [data, isUpdate]);

	async function onSubmit(values: IProductEntryV2) {
		const { product_image } = values;
		const value = normalizeOrderData(values, attributeList as { label: string; value: string }[])
			.flattened as IProductEntryV2;

		const { product_variant, product_specification, ...rest } = value;

		if (values.product_variant.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Please add at least one entry',
			});
			return;
		}

		if (isUpdate) {
			try {
				const update_product_data = updateData.mutateAsync({
					url: `/store/product/${uuid}`,
					updatedData: {
						...rest,
						updated_at: getDateTime(),
					},
					isOnCloseNeeded: false,
				});

				const parallel_promises: Promise<any>[] = [];

				if (product_specification?.length > 0) {
					const spec_promises = product_specification.map((item) => {
						if (item.uuid) {
							return updateData.mutateAsync({
								url: `/store/product-specification/${item.uuid}`,
								updatedData: {
									...item,
									updated_at: getDateTime(),
								},
								isOnCloseNeeded: false,
							});
						} else {
							return postData.mutateAsync({
								url: '/store/product-specification',
								newData: {
									...item,
									product_uuid: rest.uuid,
									uuid: nanoid(),
									created_at: getDateTime(),
									created_by: user?.uuid,
								},
								isOnCloseNeeded: false,
							});
						}
					});

					parallel_promises.push(...spec_promises);
				}

				// Handle images - these return promises
				if (product_image?.length > 0) {
					const image_promises = product_image.map((item) => {
						const formData = Formdata({
							...item,
							...(item.uuid
								? { updated_at: getDateTime() }
								: {
										product_uuid: rest.uuid,
										uuid: nanoid(),
										created_at: getDateTime(),
										created_by: user?.uuid,
									}),
						});

						if (item.uuid) {
							return imageUpdateData.mutateAsync({
								url: `/store/product-image/${item.uuid}`,
								updatedData: formData,
								isOnCloseNeeded: false,
							});
						} else {
							return imagePostData.mutateAsync({
								url: '/store/product-image',
								newData: formData,
								isOnCloseNeeded: false,
							});
						}
					});

					parallel_promises.push(...image_promises);
				}

				const processVariantsSequentially = async (): Promise<any[]> => {
					const variant_results: any[] = []; // Store results, not promises

					for (let index = 0; index < product_variant.length; index++) {
						const variant = product_variant[index];
						const variantCopy = { ...variant };

						if (variant.uuid && 'created_at' in variantCopy) {
							delete (variantCopy as any).created_at;
						}

						const variant_data = {
							...variantCopy,
							...(variant.uuid
								? {
										updated_at: getDateTime(),
									}
								: {
										uuid: nanoid(),
										product_uuid: rest.uuid,
										created_at: getDateTime(),
										created_by: user?.uuid,
										index: index + 1,
									}),
						};

						const variant_result = await (variant.uuid
							? updateData.mutateAsync({
									url: `/store/product-variant/${variant.uuid}`,
									updatedData: variant_data,
								})
							: postData.mutateAsync({
									url: '/store/product-variant',
									newData: variant_data,
								}));

						variant_results.push(variant_result);

						if (variant.product_variant_values_entry && variant.product_variant_values_entry.length > 0) {
							const entry_promises = variant.product_variant_values_entry
								.filter((item) => item != null)
								.map((item) => {
									if (item.uuid) {
										return updateData.mutateAsync({
											url: `/store/product-variant-values-entry/${item.uuid}`,
											updatedData: {
												...item,
												updated_at: getDateTime(),
											},
										});
									} else {
										return postData.mutateAsync({
											url: '/store/product-variant-values-entry',
											newData: {
												...item,
												product_variant_uuid: variant_data.uuid,
												uuid: nanoid(),
												created_at: getDateTime(),
												created_by: user?.uuid,
											},
										});
									}
								});

							// Wait for all entries to complete
							const entry_results = await Promise.all(entry_promises);
							variant_results.push(...entry_results);
						}
					}

					return variant_results;
				};

				await Promise.all([update_product_data, ...parallel_promises, processVariantsSequentially()]);

				form.reset(PRODUCT_ENTRY_NULL_V2);
				invalidateProductByUUID();
				navigate(`/store/product-entry/${rest.uuid}/details`);
			} catch (err) {
				console.error(`Error with Promise operations: ${err}`);

				ShowLocalToast({
					type: 'error',
					message: 'Failed to update product. Please try again.',
				});
			}
			return;
		}

		// CREATE MODE with same fixes
		try {
			const new_product_uuid = nanoid();
			const created_at = getDateTime();
			const created_by = user?.uuid;

			// Create main product first
			await postData.mutateAsync({
				url: '/store/product',
				newData: {
					...rest,
					uuid: new_product_uuid,
					created_at,
					created_by,
				},
				isOnCloseNeeded: false,
			});

			const independent_promises: Promise<any>[] = [];

			// Specifications
			if (product_specification?.length > 0) {
				const spec_promises = product_specification.map((item) =>
					postData.mutateAsync({
						url: '/store/product-specification',
						newData: {
							...item,
							product_uuid: new_product_uuid,
							uuid: nanoid(),
							created_at,
							created_by,
						},
						isOnCloseNeeded: false,
					})
				);
				independent_promises.push(...spec_promises);
			}

			// Images
			if (product_image?.length > 0) {
				const image_promises = product_image.map((item) => {
					const formData = Formdata({
						...item,
						product_uuid: new_product_uuid,
						uuid: nanoid(),
						created_at,
						created_by,
					});

					return imagePostData.mutateAsync({
						url: '/store/product-image',
						newData: formData,
						isOnCloseNeeded: false,
					});
				});
				independent_promises.push(...image_promises);
			}

			const processVariantsSequentiallyCreate = async (): Promise<any[]> => {
				const all_results: any[] = [];

				for (let index = 0; index < product_variant.length; index++) {
					const variant = product_variant[index];
					const variant_data = {
						...variant,
						product_uuid: new_product_uuid,
						uuid: nanoid(),
						created_at,
						created_by,
						index: index + 1,
					};

					const variant_result = await postData.mutateAsync({
						url: '/store/product-variant',
						newData: variant_data,
					});

					all_results.push(variant_result);

					if (variant.product_variant_values_entry && variant.product_variant_values_entry.length > 0) {
						const entry_promises = variant.product_variant_values_entry
							.filter((item) => item != null)
							.map((item) =>
								postData.mutateAsync({
									url: '/store/product-variant-values-entry',
									newData: {
										...item,
										product_variant_uuid: variant_data.uuid,
										uuid: nanoid(),
										created_at,
										created_by,
									},
								})
							);

						const entry_results = await Promise.all(entry_promises);
						all_results.push(...entry_results);
					}
				}

				return all_results;
			};

			// Execute all operations
			await Promise.all([Promise.all(independent_promises), processVariantsSequentiallyCreate()]);

			// Handle success
			form.reset(PRODUCT_ENTRY_NULL_V2);
			invalidateProductByUUID();
			navigate(`/store/product-entry/${new_product_uuid}/details`);
		} catch (err) {
			console.error(`Error with Promise operations: ${err}`);
			// FIXED: Proper error handling
			ShowLocalToast({
				type: 'error',
				message: 'Failed to create product. Please try again.',
			});
		}
	}

	const handleAddVariant = () => {
		const baseVariant = {
			selling_price: 0,
			discount: 0,
			discount_unit: 'bdt',
			warehouse_1: 0,
			warehouse_2: 0,
			warehouse_3: 0,
			selling_warehouse: 0,

			product_variant_values_entry: [],
		};

		const dynamicProperties = columnNames
			.filter((name) => name)
			.reduce(
				(acc, name) => {
					acc[name as string] = '';
					return acc;
				},
				{} as Record<string, string>
			);

		const newVariant = Object.assign(baseVariant, dynamicProperties);

		appendVariant(newVariant);
	};

	const handleAddSpecification = () => {
		appendSpecification({
			product_uuid: '',
			value: '',
			label: '',
			index: 0,
		});
	};

	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
		url?: string;
	} | null>(null);

	// Delete Handler
	const handleRemoveVariant = (index: number) => {
		if (variantFields[index].uuid) {
			setDeleteItem({
				id: variantFields[index].uuid,
				name: variantFields[index].uuid,
				url: '/store/product-variant',
			});
		} else {
			removeVariant(index);
		}
	};

	const handleRemoveSpecification = (index: number) => {
		if (specificationFields[index].uuid) {
			setDeleteItem({
				id: specificationFields[index].uuid,
				name: specificationFields[index].label,
				url: '/store/product-specification',
			});
		} else {
			removeSpecification(index);
		}
	};

	// Copy Handler
	const handleCopyVariant = (index: number) => {
		const field = form.watch('product_variant')[index] as Record<string, any>;

		// Create base object
		const baseProperties = {
			product_uuid: field.product_uuid,
			selling_price: field.selling_price,
			discount: field.discount,
			warehouse_1: field.warehouse_1,
			warehouse_2: field.warehouse_2,
			warehouse_3: field.warehouse_3,
			selling_warehouse: field.selling_warehouse,
			product_variant_values_entry: field.product_variant_values_entry,
		};

		const dynamicProperties: Record<string, any> = {};
		columnNames.filter(Boolean).forEach((propName) => {
			if (field.hasOwnProperty(propName as string)) {
				dynamicProperties[propName as string] = field[propName as string];
			}
		});

		appendVariant({
			...baseProperties,
			...dynamicProperties,
		});
	};

	const handleCopySpecification = (index: number) => {
		const field = form.watch('product_specification')[index];
		appendSpecification({
			product_uuid: field.product_uuid,
			value: field.value,
			label: field.label,
			index: field.index,
		});
	};

	return (
		<CoreForm.AddEditWrapper
			title={isUpdate ? 'Edit Product Entry' : ' Add Product Entry'}
			form={form}
			onSubmit={onSubmit}
		>
			<Header setDeleteItem={setDeleteItem} />
			<CoreForm.DynamicFields
				title='Product Variants'
				extraHeader={
					form.watch('is_order_exist') && (
						<span className='flex gap-1 rounded-sm bg-red-200 p-2 text-xs text-red-700'>
							<NotebookPen size={16} />
							Note: This product already have order. so you can't update exist variant
						</span>
					)
				}
				form={form}
				fieldName='product_variant'
				fieldDefs={useGenerateFieldDefs({
					copy: handleCopyVariant,
					remove: handleRemoveVariant,
					watch: form.watch,
					form,
					dynamicColumns: columnNames as string[],
				})}
				handleAdd={handleAddVariant}
				fields={variantFields}
			/>

			<CoreForm.DynamicFields
				title='Specifications'
				form={form}
				fieldName='product_specification'
				fieldDefs={useGenerateSpecification({
					copy: handleCopySpecification,
					remove: handleRemoveSpecification,
					watch: form.watch,
					form,
				})}
				handleAdd={handleAddSpecification}
				fields={specificationFields}
			/>

			<Suspense fallback={null}>
				<DeleteModal
					{...{
						deleteItem,
						setDeleteItem,
						url: deleteItem?.url || '',
						deleteData,
						invalidateQueries: invalidateProduct,
						onClose: () => {
							form.setValue(
								'product_variant',
								form.getValues('product_variant').filter((item) => item.uuid !== deleteItem?.id)
							);
						},
					}}
				/>
			</Suspense>
		</CoreForm.AddEditWrapper>
	);
};

export default Index;
