import { IProduct } from '../schema';


//* Group
export type IGroupTableData = {
	uuid: string;
	group_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Category
export type ICategoryTableData = {
	uuid: string;
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Brand
export type IBrandTableData = {
	uuid: string;
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Model
export type IModelTableData = {
	uuid: string;
	name: string;
	brand_uuid: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Attributes
export type IAttributesTableData = {
	uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Size
export type ISizeTableData = {
	uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Vendor
export type IVendorTableData = {
	uuid: string;
	model_uuid: string;
	name: string;
	company_name: string;
	phone: string;
	address: string;
	description: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Product
export type IProductTableData = {
	uuid: string;
	category_uuid: string;
	model_uuid: string;
	model_name: string;
	category_name: string;
	size_uuid: string;
	size_name: string;
	name: string;
	warehouse_1: number;
	warehouse_2: number;
	warehouse_3: number;
	warehouse_4: number;
	warehouse_5: number;
	warehouse_6: number;
	warehouse_7: number;
	warehouse_8: number;
	warehouse_9: number;
	warehouse_10: number;
	warehouse_11: number;
	warehouse_12: number;
	warehouse_1_uuid: string;
	warehouse_2_uuid: string;
	warehouse_3_uuid: string;
	warehouse_4_uuid: string;
	warehouse_5_uuid: string;
	warehouse_6_uuid: string;
	warehouse_7_uuid: string;
	warehouse_8_uuid: string;
	warehouse_9_uuid: string;
	warehouse_10_uuid: string;
	warehouse_11_uuid: string;
	warehouse_12_uuid: string;
	warranty_days: number;
	from_warehouse: number;
	service_warranty_days: number;
	is_maintaining_stock: boolean;
	created_at: string;
	updated_at: string;
	remarks: string;
};
// * Product Entry

export type IProductVariantValuesEntryTableData = {
	uuid: string|undefined;
	product_variant_uuid: string;
	attribute_uuid: string;
	attribute_name?: string;
	value: string;
};

export type IProductVariantTableData = {
	uuid: string;
	product_uuid: string;
	selling_price: number;
	discount: number;
	warehouse_1: number;
	warehouse_2: number;
	warehouse_3: number;
	selling_warehouse: number;
	[key: string]: any;
	product_variant_values_entry: IProductVariantValuesEntryTableData[];
};

export type IProductSpecificationTableData = {
	uuid: string;
	product_uuid: string;
	label: string;
	value: string;
	index: number;
};

export type IProductEntryTableData = {
	is_published: boolean;
	uuid: string;
	title: string;
	category_uuid: string;
	category_name: string;
	specifications_description: string;
	care_maintenance_description: string;
	model_uuid: string;
	model_name: string;
	warranty_days: number;
	service_warranty_days: number;

	product_image: {
		uuid: string;
		image: string;
		product_uuid: string;
		is_main: boolean;
	}[];

	product_variant: IProductVariantTableData[];

	product_specification: IProductSpecificationTableData[];

	reviews: string[];

	created_at: string;
	created_by_name: string;
	updated_at: string;
	remarks: string;
};
//* Purchase
export type IPurchaseTableData = {
	uuid: string;
	id: string;
	vendor_uuid: string;
	branch_uuid: string;
	date: string;
	payment_mode: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Purchase Entry
export type IPurchaseEntryTableData = {
	uuid: string;
	purchase_uuid: string;
	purchase_id: string;
	stock_uuid: string;
	stock_id: string;
	serial_no: string;
	quantity: number;
	price_per_unit: number;
	discount: number;
	branch_name: string;
	warehouse_name: string;
	rack_name: string;
	floor_name: string;
	box_name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Purchase Details
export type IPurchaseDetails = {
	uuid: string;
	purchase_id: string;
	vendor_uuid: string;
	vendor_name: string;
	branch_uuid: string;
	branch_name: string;
	date: string;
	payment_mode: string;
	created_at: string;
	updated_at: string;
	remarks: string;
	purchase_entry: IPurchaseEntryTableData[];
};
//* Purchase Return
export type IPurchaseReturnTableData = {
	uuid: string;
	id: string;
	purchase_uuid: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Purchase Return Entry
export type IPurchaseReturnEntryTableData = {
	uuid: string;
	purchase_return_uuid: string;
	purchase_return_id: string;
	product_uuid: string;
	quantity: number;
	price_per_unit: number;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Purchase Return Details
export type IPurchaseReturnDetails = {
	uuid: string;
	purchase_return_id: string;
	purchase_uuid: string;
	purchase_id: string;
	remarks: string;
	created_at: string;
	updated_at: string;
	purchase_return_entry: IPurchaseReturnEntryTableData[];
};
//* Stock
export type IStockTableData = {
	uuid: string;
	stock_id: string;
	product_uuid: string;
	product_name: string;
	warehouse1: number;
	warehouse2: number;
	warehouse3: number;
	remarks: string;
};
// * Internal Transfer
export interface IInternalTransferTableData {
	uuid: string;
	internal_transfer_id: string;
	stock_uuid: string;
	stock_id: string;
	from_branch_uuid: string;
	to_branch_uuid: string;
	warehouse_uuid: string;
	rack_uuid: string;
	floor_uuid: string;
	box_uuid: string;
	from_warehouse: number;
	quantity: number;
	remarks: string;
	from_branch_name: string;
	from_warehouse_name: string;
	to_warehouse_name: string;
	to_branch_name: string;
	rack_name: string;
	floor_name: string;
	box_name: string;
	created_at: string;
	created_by: string;
	updated_at: string;
}
//* Transfer
export type ITransferTableData = {
	uuid: string;
	id: string;
	warehouse_uuid: string;
	warehouse_name: string;
	branch_uuid?: string;
	branch_name?: string;
	max_quantity?: number;
	product_name: string;
	product_uuid: string;
	order_id: string;
	order_uuid: string;
	info_uuid: string;
	quantity: number;
	created_at: string;
	updated_at: string;
	remarks: string;
};

//* Internal Transfer Action

export type IStockActionTrx = {
	uuid: string;
	name: string;
	max_quantity?: number;
	warehouse_uuid?: string;
	product_uuid?: string;
};
//* Branch
export type IBranchTableData = {
	uuid: string;
	name: string;
	address: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Warehouse
export type IWarehouseTableData = {
	uuid: string;
	brach_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Room
export type IRoomTableData = {
	uuid: string;
	warehouse_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Rack
export type IRackTableData = {
	uuid: string;
	warehouse_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Floor
export type IFloorTableData = {
	uuid: string;
	rack_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* Box
export type IBoxTableData = {
	uuid: string;
	floor_uuid: string;
	name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};

//* Fetch
export type IWarehouseFetch = { label: string; value: string; assigned: string }[] | undefined;
export type IWarehouseKey =
	| 'warehouse_1'
	| 'warehouse_2'
	| 'warehouse_3'
	| 'warehouse_4'
	| 'warehouse_5'
	| 'warehouse_5'
	| 'warehouse_6'
	| 'warehouse_7'
	| 'warehouse_8'
	| 'warehouse_9'
	| 'warehouse_10'
	| 'warehouse_11'
	| 'warehouse_12';

//* Shipping Address
export type IShippingAddress = {
	uuid: string;
	bill_info_uuid: string;
	name: string;
	company_name: string;
	phone: string;
	address: string;
	city: string;
	district: string;
	zip: string;
	note: string;
	created_at: string;
	updated_at: string;
	remarks: string;
};

//* Ordered
export type IOrdered = {
	uuid: string;
	order_id: string;
	product_variants: string;
	quantity: number;
	selling_price: number;
	is_paid: boolean;
	product_serial: string;
	[key: string]: string | number | boolean;
	created_at: string;
	updated_at: string;
	remarks: string;
};

//* Bill Info
export type IBillInfo = {
	uuid: string;
	user_uuid: string;
	name: string;
	phone: string;
	email: string;
	address: string;
	bill_id: string;
	city: string;
	district: string;
	note: string;
	is_ship_different: boolean;
	is_paid: boolean;
	bill_status: 'pending' | 'completed' | 'canceled';

	payment_method: 'bkash' | 'cod';
	created_at: string;
	updated_at: string;
	remarks: string;
	ship_address: IShippingAddress | null;
	order_details: IOrdered[];
};