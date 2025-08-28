import { IOrdered, IProductVariantValuesEntryTableData } from '../_config/columns/columns.type';
import { IBillInfo } from '../_config/schema';


export function flattenOrderData(orderData: IBillInfo | null | undefined | [] | any) {
	if (!orderData) {
		return {
			flattened: null,
			columnNames: [],
		};
	}
	if (!orderData.order_details || !Array.isArray(orderData.order_details)) {
		return {
			flattened: { ...orderData, order_details: [] },
			columnNames: [],
		};
	}

	const flattened = JSON.parse(JSON.stringify(orderData));
	const columnNames = new Set<string>();

	flattened.order_details.forEach((detail: IOrdered) => {
		if (Array.isArray(detail.product_variant_values_entry)) {
			detail.product_variant_values_entry.forEach((entry: IProductVariantValuesEntryTableData) => {
				detail[entry.attribute_name] = entry.value;
				columnNames.add(entry.attribute_name);
			});
			delete detail.product_variant_values_entry;
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