import {
	IOrdered,
	IProductEntryTableData,
	IProductVariantTableData,
	IProductVariantValuesEntryTableData,
} from '../_config/columns/columns.type';
import { IBillInfo } from '../_config/schema';

export function flattenOrderData(orderData: IBillInfo | null | undefined | [] | any) {
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
				detail[entry.attribute_name as string] = entry.value;
				columnNames.add(entry.attribute_name as string);
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

	flattened.product_variant.forEach((detail: IProductVariantTableData) => {
		if (!Array.isArray(detail.product_variant_values_entry)) {
			detail.product_variant_values_entry = [];
		}

		const entriesArray = detail.product_variant_values_entry as IProductVariantValuesEntryTableData[];
		const validAttributeUuids = attributes.map((attr) => attr.value);
		detail.product_variant_values_entry = entriesArray.filter((entry) =>
			validAttributeUuids.includes(entry.attribute_uuid)
		);

		const existingEntries = new Map<string, IProductVariantValuesEntryTableData>();
		detail.product_variant_values_entry.forEach((entry) => {
			existingEntries.set(entry.attribute_uuid, entry);
		});

		attributes.forEach((attr) => {
			const value = ((detail as any)[attr.label] as string) || '';
			const existingEntry = existingEntries.get(attr.value);

			if (existingEntry) {
				existingEntry.value = value;
			} else {
				detail.product_variant_values_entry.push({
					uuid: '',
					product_variant_uuid: detail.uuid,
					attribute_uuid: attr.value,
					attribute_name: attr.label,
					value: value,
				});
			}
		});
	});

	return { flattened, columnNames: Array.from(columnNames) };
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
