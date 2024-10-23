// Order Table Data Type
export type IOrderTableData = {
	uuid: string;
	id: number;
	order_number: string;
	pi_numbers: string[];
	party_uuid: string;
	party_name: string;
	marketing_uuid: string;
	marketing_name: string;
	factory_uuid: string;
	factory_name: string;
	factory_address: string;
	merchandiser_uuid: string;
	merchandiser_name: string;
	buyer_uuid: string;
	buyer_name: string;
	is_sample: number;
	is_bill: number;
	is_cash: number;
	delivery_date: string;
	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
	swatch_approval_count: string;
	order_entry_count: string;
	is_swatches_approved: number;
};

// Order Details Type
export type IOrderDetails = {
	id: number;
	uuid: string;
	order_number: string;
	pi_numbers: any;
	party_uuid: string;
	party_name: string;
	marketing_uuid: string;
	marketing_name: string;
	factory_uuid: string;
	factory_name: string;
	factory_address: string;
	merchandiser_uuid: string;
	merchandiser_name: string;
	buyer_uuid: string;
	buyer_name: string;
	is_sample: boolean;
	is_bill: boolean;
	is_cash: boolean;
	delivery_date: string;
	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: any;
	remarks: string;
	swatch_approval_count: string;
	order_entry_count: string;
	is_swatches_approved: boolean;
	order_info_entry: IOrderDetailsEntry[];
};

export interface IOrderDetailsEntry {
	id: string;
	uuid: string;
	order_entry_uuid: string;
	order_info_uuid: string;
	lab_reference: any;
	color: string;
	recipe_uuid: any;
	recipe_name: any;
	po: any;
	style: string;
	count_length_uuid: string;
	count: string;
	length: string;
	count_length_name: string;
	quantity: number;
	company_price: number;
	party_price: number;
	swatch_approval_date: any;
	production_quantity: number;
	bleaching: string;
	transfer_quantity: number;
	carton_quantity: number;
	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: any;
	remarks: string;
	pi: number;
	delivered: number;
	warehouse: number;
	short_quantity: number;
	reject_quantity: number;
	production_quantity_in_kg: number;
	yarn_quantity: number;
}
