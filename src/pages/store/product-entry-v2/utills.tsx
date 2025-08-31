import { IOrdered, IProductVariantValuesEntryTableData } from '../_config/columns/columns.type';
import { IBillInfo } from '../_config/schema';

export function flattenOrderData(
	orderData: IBillInfo | null | undefined | [] | any,
) {
	if (!orderData) {
		return {
			flattened: null,
			columnNames: [],
		};
	}
	if (!orderData.product_variant || !Array.isArray(orderData.product_variant)) {
		return {
			flattened: { ...orderData, product_variant: [] },
			columnNames: [],
		};
	}

	const flattened = JSON.parse(JSON.stringify(orderData));
	const columnNames = new Set<string>();

	flattened.product_variant.forEach((detail: IOrdered) => {
		if (Array.isArray(detail.product_variant_values_entry)) {
			detail.product_variant_values_entry.forEach((entry: IProductVariantValuesEntryTableData) => {
				detail[entry.attribute_name] = entry.value;
				columnNames.add(entry.attribute_name);
			});
		}
	});

	return {
		flattened,
		columnNames: Array.from(columnNames),
	};
}
export function normalizeOrderData(
	orderData: IBillInfo | null | undefined | [] | any,
	attributes: { label: string; value: string }[]
) {
	if (!orderData) {
		return {
			flattened: null,
			columnNames: [],
		};
	}
	if (!orderData.product_variant || !Array.isArray(orderData.product_variant)) {
		return {
			flattened: { ...orderData, product_variant: [] },
			columnNames: [],
		};
	}

	const flattened = JSON.parse(JSON.stringify(orderData));
	const columnNames = new Set<string>();

	flattened.product_variant.forEach((detail: IOrdered) => {
		if (Array.isArray(detail.product_variant_values_entry) && detail.product_variant_values_entry.length === 0) {
			attributes.map((attribute) => {
				Array.isArray(detail.product_variant_values_entry) &&
					detail.product_variant_values_entry.push({
						attribute_uuid: attribute.value,
						value: detail[attribute.label],
					});
			});
		} else if (Array.isArray(detail.product_variant_values_entry)) {
			detail.product_variant_values_entry.forEach((entry: IProductVariantValuesEntryTableData) => {
				const attribute = attributes.find((a) => a.value === entry.attribute_uuid)?.label;
				entry.value = detail[attribute as string] as string;
			});
		}
	});

	return {
		flattened,
		columnNames: Array.from(columnNames),
	};
}

export const order_status = [
	{
		label: 'Pending',
		value: 'pending',
	},
	{
		label: 'Completed',
		value: 'completed',
	},
	{
		label: 'Cancelled',
		value: 'cancelled',
	},
];
