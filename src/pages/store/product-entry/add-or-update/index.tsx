import { lazy, Suspense, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useRHF from '@/hooks/useRHF';

import { ShowLocalToast } from '@/components/others/toast';
import CoreForm from '@core/form';

import nanoid from '@/lib/nanoid';
import { getDateTime } from '@/utils';
import Formdata from '@/utils/formdata';

import { useStoreProducts, useStoreProductsByUUID } from '../../_config/query';
import { IProductEntry, PRODUCT_ENTRY_NULL, PRODUCT_ENTRY_SCHEMA } from '../../_config/schema';
import Header from './header';
import useGenerateSpecification from './useGenerateSpecification';
import useGenerateFieldDefs from './useGenerateVariant';

const AddOrUpdate = lazy(() => import('./attributes-modal'));
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

	const form = useRHF(PRODUCT_ENTRY_SCHEMA, PRODUCT_ENTRY_NULL);

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

	useEffect(() => {
		if (isUpdate && data) {
			form.reset(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isUpdate]);

	async function onSubmit(values: IProductEntry) {
		const { product_variant, product_specification, product_image, ...rest } = values;

		if (values.product_variant.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Please add at least one entry',
			});
			return;
		}

		if (isUpdate) {
			let update_promises: Promise<any>[] = [];

			const update_product_data = await updateData.mutateAsync({
				url: `/store/product/${uuid}`,
				updatedData: {
					...rest,
					updated_at: getDateTime(),
				},
				isOnCloseNeeded: false,
			});

			//? Specification POST
			if (product_specification.length > 0) {
				const update_product_specification_promise = product_specification.map((item) => {
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

				update_promises = [...update_promises, ...update_product_specification_promise];
			}

			//? Image UPDATE
			if (product_image.length > 0) {
				const update_product_image_promise = product_image.map((item) => {
					if (item.uuid) {
						const formData = Formdata({
							...item,
							updated_at: getDateTime(),
						});

						return imageUpdateData.mutateAsync({
							url: `/store/product-image/${item.uuid}`,
							updatedData: formData,
							isOnCloseNeeded: false,
						});
					} else {
						const formData = Formdata({
							...item,
							product_uuid: rest.uuid,
							uuid: nanoid(),
							created_at: getDateTime(),
							created_by: user?.uuid,
						});

						return imagePostData.mutateAsync({
							url: '/store/product-image',
							newData: formData,
							isOnCloseNeeded: false,
						});
					}
				});

				update_promises = [...update_promises, ...update_product_image_promise];
			}

			//? Variant UPDATE
			const update_product_variant_promise = product_variant.map((variant, index) => {
				if (variant.uuid) {
					const variant_data = {
						...variant,
						updated_at: getDateTime(),
					};

					const variant_promise = updateData.mutateAsync({
						url: `/store/product-variant/${variant.uuid}`,
						updatedData: variant_data,
					});

					if (variant.product_variant_values_entry.length > 0) {
						const product_variant_entry_promise = variant.product_variant_values_entry.map((item) => {
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
										product_variant_uuid: variant.uuid,
										uuid: nanoid(),
										created_at: getDateTime(),
										created_by: user?.uuid,
									},
								});
							}
						});

						update_promises = [...update_promises, ...product_variant_entry_promise];
					}

					return variant_promise;
				} else {
					const variant_data = {
						...variant,
						uuid: nanoid(),
						product_uuid: rest.uuid,
						created_at: getDateTime(),
						created_by: user?.uuid,
						index: index + 1,
					};

					const variant_promise = postData.mutateAsync({
						url: '/store/product-variant',
						newData: variant_data,
					});

					if (variant.product_variant_values_entry.length > 0) {
						const product_variant_entry_promise = variant.product_variant_values_entry.map((item) =>
							postData.mutateAsync({
								url: '/store/product-variant-values-entry',
								newData: {
									...item,
									product_variant_uuid: variant_data.uuid,
									uuid: nanoid(),
									created_at: getDateTime(),
									created_by: user?.uuid,
								},
							})
						);

						update_promises = [...update_promises, ...product_variant_entry_promise];
					}

					return variant_promise;
				}
			});

			try {
				await Promise.all([update_product_data, ...update_promises, ...update_product_variant_promise])
					.then(() => form.reset(PRODUCT_ENTRY_NULL))
					.then(() => {
						invalidateProductByUUID();
						navigate(`/store/product-entry/${rest.uuid}/update`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		const new_product_uuid = nanoid();
		const created_at = getDateTime();
		const created_by = user?.uuid;
		let promises: Promise<any>[] = [];

		const product_promise = await postData.mutateAsync({
			url: '/store/product',
			newData: {
				...rest,
				uuid: new_product_uuid,
				created_at,
				created_by,
			},
			isOnCloseNeeded: false,
		});

		//? Specification POST
		if (product_specification.length > 0) {
			const new_product_specification_promise = product_specification.map((item) =>
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

			promises = [...promises, ...new_product_specification_promise];
		}

		//? Image POST
		if (product_image.length > 0) {
			const new_product_image_promise = product_image.map((item) => {
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

			promises = [...promises, ...new_product_image_promise];
		}

		//? Variant POST
		const product_variant_promise = product_variant.map((variant, index) => {
			const variant_data = {
				...variant,
				product_uuid: new_product_uuid,
				uuid: nanoid(),
				created_at,
				created_by,
				index: index + 1,
			};

			const new_product_variant_promise = postData.mutateAsync({
				url: '/store/product-variant',
				newData: variant_data,
			});

			if (variant.product_variant_values_entry.length > 0) {
				const new_product_variant_entry_promise = variant.product_variant_values_entry.map((item) =>
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

				promises = [...promises, ...new_product_variant_entry_promise];
			}

			return new_product_variant_promise;
		});

		try {
			await Promise.all([product_promise, ...promises, ...product_variant_promise])
				.then(() => form.reset(PRODUCT_ENTRY_NULL))
				.then(() => {
					invalidateProductByUUID();
					navigate(`/store/product-entry/${new_product_uuid}/update`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	}

	const handleAddVariant = () => {
		appendVariant({
			selling_price: 0,
			discount: 0,
			warehouse_1: 0,
			warehouse_2: 0,
			warehouse_3: 0,
			selling_warehouse: 0,
			product_variant_values_entry: [],
		});
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
		const field = form.watch('product_variant')[index];
		appendVariant({
			product_uuid: field.product_uuid,
			selling_price: field.selling_price,
			discount: field.discount,
			warehouse_1: field.warehouse_1,
			warehouse_2: field.warehouse_2,
			warehouse_3: field.warehouse_3,
			selling_warehouse: field.selling_warehouse,
			product_variant_values_entry: field.product_variant_values_entry,
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

	const [isOpenAddModal, setIsOpenAddModal] = useState(false);
	const [updatedData, setUpdatedData] = useState<IProductEntry['product_variant'][number] | null>(null);
	const handleAttributes = (index: number) => {
		const field = form.watch('product_variant')[index];
		setUpdatedData({ ...field, index });
		setIsOpenAddModal(true);
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
				form={form}
				fieldName='product_variant'
				fieldDefs={useGenerateFieldDefs({
					copy: handleCopyVariant,
					remove: handleRemoveVariant,
					watch: form.watch,
					form,
					handleAttributes: handleAttributes,
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
				<AddOrUpdate
					{...{
						url: `/store/product-entry`,
						open: isOpenAddModal,
						setOpen: setIsOpenAddModal,
						updatedData,
						setUpdatedData,
						postData,
						updateData,
						deleteData,
						form: form,
					}}
				/>
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
