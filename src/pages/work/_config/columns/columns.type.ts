//* Problems Columns
export type IProblemsTableData = {
	uuid: string;
	name: string;
	category: 'employee' | 'customer';
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;
};
//* Diagnosis Columns
export type IDiagnosisTableData = {
	uuid: string;
	id: string;
	diagnosis_id: string;
	info_id: string;
	reclaimed_order_uuid: string;
	reclaimed_order_id: string;
	is_reclaimed: boolean;
	order_uuid: string;
	info_uuid: string;
	order_id: string;
	user_name: string;
	user_phone: string;
	engineer_uuid: string;
	problems_uuid: string[];
	brand_name: string;
	model_name: string;
	serial_no: string;
	diagnosis_problems_name: string[];
	order_problems_name: string[];
	order_problem_statement: string;
	problem_statement: string;
	customer_problem_statement: string;
	status: 'pending' | 'rejected' | 'accepted' | 'not_repairable';
	status_update_date: string;
	proposed_cost: number;
	is_proceed_to_repair: boolean;
	customer_remarks: string;
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;

	image_1?: string;
	image_2?: string;
	image_3?: string;
};
//* Transfer
export type ITransferTableData = {
	uuid: string;
	id: string;
	warehouse_uuid: string;
	warehouse_name: string;
	max_quantity?: number;
	product_name: string;
	product_uuid: string;
	purchase_entry_uuid: string;
	serial_no: string;
	order_id: string;
	order_uuid: string;
	info_uuid: string;
	quantity: number;
	created_at: string;
	updated_at: string;
	remarks: string;
};
//* IStockTrx
export type IStockActionTrx = {
	uuid: string;
	name: string;
	max_quantity?: number;
	warehouse_uuid?: string;
	product_uuid?: string;
	purchase_entry_uuid?: string;
};
//* Order Columns
export type IOrderTableData = {
	is_reclaimed: boolean;
	advance_pay: number;
	engineer_uuid: string;
	engineer_name: string;
	reclaimed_order_uuid: any;
	reclaimed_order_id: string;
	new_order_id: string;
	reclaimed_id: string;
	id: string;
	order_id: string;
	order_uuid: string;
	is_proceed_to_repair: boolean;
	new_order_uuid: string;
	uuid: string;
	user_name: string;
	user_phone: string;
	is_product_received: boolean;
	is_diagnosis_needed: boolean;
	is_delivery_complete?: boolean;
	is_home_repair: boolean;
	is_challan_needed: boolean;
	received_date: string;
	user_id: string;
	model_uuid: string;
	model_name: string;
	brand_name: string;
	size_uuid: string;
	size_name: string;
	serial_no: string;
	product: string;
	accessoriesString: string;
	problems_uuid: string[];
	order_problems_name: string[];
	diagnosis_problems_name: string[];
	repairing_problems_name: string[];
	qc_problems_name: string[];
	delivery_problems_name: string[];
	problem_statement: string;
	diagnosis_problem_statement: string;
	repairing_problem_statement: string;
	qc_problem_statement: string;
	delivery_problem_statement: string;
	accessories: string[];
	accessories_name: string[];
	info_uuid: string;
	info_id: string;
	is_transferred_for_qc: boolean;
	is_ready_for_delivery: boolean;
	ready_for_delivery_date: string;
	is_diagnosis_need: boolean;
	branch_name: string;
	warehouse_uuid: string;
	warehouse_name: string;
	rack_uuid: string;
	rack_name: string;
	floor_uuid: string;
	floor_name: string;
	box_uuid: string;
	box_name: string;
	quantity: number;
	unit: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	diagnosis?: IDiagnosisTableData;
	product_transfer?: ITransferTableData[];
	process?: IProcessTableData[];
	remarks: string;
	image_1?: string;
	image_2?: string;
	image_3?: string;
	status_update_date: string;
	status: string;
	diagnosis_proposed_cost: number;
	bill_amount: number;
	proposed_cost: number;
	challan_no: string;
	challan_type: string;
};
//* Info Columns
export type IInfoTableData = {
	uuid: string;
	received_by_name: string;
	received_by_uuid: string;
	order_type: '';
	is_new_customer?: boolean;
	branch_uuid: string;
	branch_name: string;
	name: string;
	phone: string;
	user_phone: string;
	user_email: string;
	submitted_by: 'customer' | 'employee';
	user_id: string;
	id: string;
	info_id: string;
	customer_feedback?: string;
	is_contact_with_customer?: boolean;
	order_info_status: 'accepted' | 'pending' | 'rejected';
	user_uuid: string;
	user_name: string;
	zone_name: string;
	location: string;
	designation_uuid: string;
	department_uuid: string;
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	is_product_received: boolean;
	received_date: string;
	delivered_count: number;
	order_count: number;
	order_entry: IOrderTableData[];

	reference_user_name: string;
	commission_amount: number;
	is_commission_amount: boolean;
};

//* Section Columns
export type ISectionTableData = {
	uuid: string;
	name: string;
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;
};
//* Process Columns
export type IProcessTableData = {
	id: string;
	index: number;
	process_id: string;
	uuid: string;
	section_uuid: string;
	section_name: string;
	order_uuid: string;
	diagnosis_uuid: string;
	engineer_uuid: string;
	problems_uuid: string[];
	problems_name: string[];
	problem_statement: string;
	status: boolean;
	status_update_date: string;
	is_transferred_for_qc: boolean;
	is_ready_for_delivery: boolean;
	warehouse_uuid: string;
	rack_uuid: string;
	floor_uuid: string;
	box_uuid: string;
	process_uuid: string;
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;
};

//*Zone
export type IZoneTableData = {
	uuid: string;
	id: number;
	division: string;
	latitude: string;
	longitude: string;
	name: string;
	remarks: string;
	created_by: string;
	created_at: string;
	updated_at: string;
};

//* Accessories
export type IAccessoriesTableData = {
	uuid: string;
	name: string;
};
