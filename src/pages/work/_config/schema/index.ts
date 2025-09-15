import { z } from 'zod';



import { BOOLEAN_OPTIONAL, BOOLEAN_REQUIRED, NUMBER, NUMBER_DOUBLE_OPTIONAL, NUMBER_DOUBLE_REQUIRED, NUMBER_OPTIONAL, NUMBER_REQUIRED, PHONE_NUMBER_OPTIONAL, STRING_ARRAY, STRING_ARRAY_OPTIONAL, STRING_NULLABLE, STRING_OPTIONAL, STRING_REQUIRED } from '@/utils/validators';





const customIssue = (message: string, path: string) => ({
	code: z.ZodIssueCode.custom,
	message: message,
	path: [path],
});

//*Order Schema
export const ORDER_SCHEMA = z
	.object({
		uuid: STRING_OPTIONAL,
		is_diagnosis_need: BOOLEAN_REQUIRED.default(false),
		is_transferred_for_qc: BOOLEAN_OPTIONAL.default(false),
		is_ready_for_delivery: BOOLEAN_OPTIONAL.default(false),
		is_proceed_to_repair: BOOLEAN_REQUIRED.default(false),
		is_challan_needed: BOOLEAN_REQUIRED.default(false),
		is_home_repair: BOOLEAN_REQUIRED.default(false),
		engineer_uuid: STRING_OPTIONAL.nullable(),
		brand_uuid: STRING_REQUIRED,
		model_uuid: STRING_REQUIRED,
		model_id: STRING_OPTIONAL,
		quantity: NUMBER_DOUBLE_REQUIRED,
		advance_pay: NUMBER_DOUBLE_OPTIONAL.default(0),
		proposed_cost: NUMBER_DOUBLE_OPTIONAL,
		reclaimed_order_uuid: STRING_NULLABLE.optional(),
		bill_amount: NUMBER_DOUBLE_OPTIONAL.default(0),
		serial_no: STRING_OPTIONAL.nullable(),
		problems_uuid: STRING_ARRAY,
		problem_statement: STRING_REQUIRED,
		qc_problems_uuid: STRING_ARRAY_OPTIONAL.nullable(),
		qc_problem_statement: STRING_NULLABLE.optional(),
		delivery_problems_uuid: STRING_ARRAY_OPTIONAL,
		delivery_problem_statement: STRING_NULLABLE.optional(),
		accessories: STRING_ARRAY_OPTIONAL.nullable(),
		warehouse_uuid: STRING_NULLABLE,
		is_reclaimed: BOOLEAN_OPTIONAL.default(false),
		rack_uuid: STRING_NULLABLE.optional(),
		floor_uuid: STRING_NULLABLE.optional(),
		box_uuid: STRING_NULLABLE.optional(),
		remarks: STRING_NULLABLE.optional(),
		image_1: z.instanceof(File).or(STRING_NULLABLE).optional(),
		image_2: z.instanceof(File).or(STRING_NULLABLE).optional(),
		image_3: z.instanceof(File).or(STRING_NULLABLE).optional(),
	})
	.superRefine((data, ctx) => {
		if (data?.problems_uuid.length === 0 && !data?.is_proceed_to_repair) {
			ctx.addIssue(customIssue('Required', 'problems_uuid'));
		}
		if (data?.is_home_repair && !(data?.bill_amount > 0)) {
			ctx.addIssue(customIssue('Required', 'bill_amount'));
		}
		if (data?.is_home_repair && !(typeof data?.proposed_cost === 'number' && data.proposed_cost > 0)) {
			ctx.addIssue(customIssue('Required', 'proposed_cost'));
		}
	});
export const ORDER_NULL: Partial<IOrder> = {
	is_diagnosis_need: false,
	is_transferred_for_qc: false,
	is_ready_for_delivery: false,
	is_proceed_to_repair: false,
	bill_amount: 0,
	proposed_cost: 0,
	advance_pay: 0,
	brand_uuid: '',
	model_uuid: '',
	serial_no: '',
	quantity: 1,
	problems_uuid: undefined,
	problem_statement: '',
	accessories: undefined,
	warehouse_uuid: null,
	rack_uuid: null,
	floor_uuid: null,
	box_uuid: null,
	remarks: null,
	qc_problems_uuid: undefined,
	delivery_problems_uuid: undefined,
	delivery_problem_statement: null,
	qc_problem_statement: null,
	image_1: null,
	image_2: null,
	image_3: null,
};
export type IOrder = z.infer<typeof ORDER_SCHEMA>;
//*Order Schema
export const REPAIR_SCHEMA = z
	.object({
		uuid: STRING_OPTIONAL,
		engineer_uuid: STRING_OPTIONAL.nullable(),
		is_transferred_for_qc: BOOLEAN_OPTIONAL.default(false),
		is_ready_for_delivery: BOOLEAN_OPTIONAL.default(false),
		repairing_problems_uuid: STRING_ARRAY_OPTIONAL,
		repairing_problem_statement: STRING_NULLABLE,
		repair_product_transfer: BOOLEAN_OPTIONAL.default(false),
		ready_for_delivery_date: STRING_NULLABLE.optional(),
		product_transfer: z.array(
			z.object({
				uuid: STRING_OPTIONAL,
				purchase_entry_uuid: STRING_OPTIONAL,
				warehouse_uuid: STRING_OPTIONAL,
				remarks: STRING_NULLABLE,
			})
		),
		remarks: STRING_NULLABLE,
	})
	.superRefine((data, ctx) => {
		if (data?.repair_product_transfer) {
			data?.product_transfer.map((transfer, index) => {
				if (!transfer.purchase_entry_uuid) {
					ctx.addIssue(customIssue('Required', `product_transfer[${index}].purchase_entry_uuid`));
				}
			});
		}
	});

export const REPAIR_NULL: Partial<IRepair> = {
	is_transferred_for_qc: false,
	is_ready_for_delivery: false,
	repairing_problems_uuid: undefined,
	ready_for_delivery_date: null,
	repair_product_transfer: false,
	product_transfer: [
		{
			uuid: '',
			purchase_entry_uuid: '',
			remarks: null,
		},
	],
	remarks: null,
};
export type IRepair = z.infer<typeof REPAIR_SCHEMA>;

export const MESSAGE_SCHEMA = z.object({
	message: STRING_REQUIRED,
});
export const MESSAGE_NULL: Partial<IMessage> = {
	message: '',
};
export type IMessage = z.infer<typeof MESSAGE_SCHEMA>;

//* Info Schema
const ORDER_SCHEMA_FOR_INFO = (ORDER_SCHEMA as any)._def.schema.omit({
	is_transferred_for_qc: true,
	is_ready_for_delivery: true,
	delivery_problem_statement: true,
	qc_problem_statement: true,
});
export const INFO_SCHEMA = z
	.object({
		is_new_customer: BOOLEAN_OPTIONAL.default(false),
		uuid: STRING_OPTIONAL,
		user_uuid: STRING_NULLABLE,
		name: STRING_OPTIONAL,
		phone: PHONE_NUMBER_OPTIONAL,
		business_type: STRING_OPTIONAL,
		branch_uuid: STRING_REQUIRED,
		customer_feedback: STRING_NULLABLE.optional(),
		is_contact_with_customer: BOOLEAN_OPTIONAL.default(false),
		order_type: z.enum(['normal', 'priority', 'due']).optional(),
		order_info_status: z.enum(['accepted', 'pending', 'rejected', 'cancel']).nullable().optional(),
		where_they_find_us: z.enum(['whatsapp', 'instagram', 'facebook', 'youtube', 'person', 'none']).optional(),
		designation_uuid: STRING_OPTIONAL,
		department_uuid: STRING_OPTIONAL,
		is_product_received: BOOLEAN_REQUIRED,
		location: STRING_REQUIRED,
		zone_uuid: STRING_REQUIRED,
		received_date: STRING_NULLABLE,
		received_by: STRING_NULLABLE.optional(),

		remarks: STRING_NULLABLE,
		order_entry: z.array(ORDER_SCHEMA_FOR_INFO),
		reference_user_uuid: STRING_OPTIONAL.nullable(),
		is_commission_amount: BOOLEAN_OPTIONAL.default(false),
		commission_amount: NUMBER_REQUIRED.default(0),
		submitted_by: z.enum(['customer', 'employee']).default('customer').optional().nullable(),
	})
	.superRefine((data, ctx) => {
		if (!data.is_new_customer && !data.user_uuid) {
			ctx.addIssue(customIssue('Required', 'user_uuid'));
		}
		if (data.is_new_customer) {
			if (!data.name) {
				ctx.addIssue(customIssue('Required', 'name'));
			}
			if (!data.phone) {
				ctx.addIssue(customIssue('Required', 'phone'));
			}
			if (!data.business_type) {
				ctx.addIssue(customIssue('Required', 'business_type'));
			}
		}
		if (
			data?.reference_user_uuid !== null &&
			data?.reference_user_uuid !== '' &&
			data?.reference_user_uuid !== undefined
		) {
			if (data?.commission_amount < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['commission_amount'],
					message: 'Amount must be greater than 0',
				});
			}
		}

		if (data.is_product_received) {
			if (!data.received_date) {
				ctx.addIssue(customIssue('Required', 'received_date'));
			}
			data?.order_entry.map((entry, index) => {
				if (!entry.warehouse_uuid && !entry.is_home_repair) {
					ctx.addIssue(customIssue('Required', `order_entry[${index}].warehouse_uuid`));
				}
				if (!entry.serial_no) {
					ctx.addIssue(customIssue('Required', `order_entry[${index}].serial_no`));
				}
			});
		}
	});
export const INFO_NULL: Partial<IInfo> = {
	is_new_customer: false,
	uuid: '',
	user_uuid: null,
	order_type: 'normal',
	is_product_received: false,

	received_date: null,
	where_they_find_us: 'none',
	name: '',
	phone: undefined,
	business_type: '',
	branch_uuid: '',
	designation_uuid: '',
	department_uuid: '',
	location: '',
	zone_uuid: '',
	reference_user_uuid: null,
	is_commission_amount: false,

	commission_amount: 0,
	order_entry: [ORDER_NULL as IOrder],
	remarks: null,
};

export type IInfo = z.infer<typeof INFO_SCHEMA>;

//* Diagnosis Schema
export const DIAGNOSIS_SCHEMA = z.object({
	problems_uuid: STRING_ARRAY,
	problem_statement: STRING_NULLABLE,
	customer_problem_statement: STRING_NULLABLE,
	status: z.enum(['pending', 'rejected', 'accepted', 'not_repairable', 'customer_reject']),
	proposed_cost: NUMBER_DOUBLE_REQUIRED,
	is_proceed_to_repair: BOOLEAN_OPTIONAL.default(false),
	remarks: STRING_NULLABLE,
	customer_remarks: STRING_NULLABLE,
});
export const DIAGNOSIS_NULL: Partial<IDiagnosis> = {
	problems_uuid: [],
	problem_statement: null,
	customer_problem_statement: null,
	status: 'pending',
	proposed_cost: 0,
	is_proceed_to_repair: false,
	remarks: null,
};
export type IDiagnosis = z.infer<typeof DIAGNOSIS_SCHEMA>;

//* Section Schema
export const SECTION_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const SECTION_NULL: Partial<ISection> = {
	uuid: '',
	name: '',
	remarks: null,
};
export type ISection = z.infer<typeof SECTION_SCHEMA>;

//* Problem Schema
export const PROBLEM_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_REQUIRED,
	category: z.enum(['customer', 'employee']),
	remarks: STRING_NULLABLE,
});
export const PROBLEM_NULL: Partial<IProblem> = {
	uuid: '',
	name: '',
	category: 'customer',
	remarks: null,
};
export type IProblem = z.infer<typeof PROBLEM_SCHEMA>;
//* Process Schema
export const PROCESS_SCHEMA = z.object({
	problems_uuid: STRING_ARRAY_OPTIONAL,
	problem_statement: STRING_NULLABLE,
	status: BOOLEAN_OPTIONAL,
	status_update_date: STRING_NULLABLE,
	is_transferred_for_qc: BOOLEAN_OPTIONAL,
	is_ready_for_delivery: BOOLEAN_OPTIONAL,
	warehouse_uuid: STRING_REQUIRED,
	rack_uuid: STRING_NULLABLE,
	floor_uuid: STRING_NULLABLE,
	box_uuid: STRING_NULLABLE,
	remarks: STRING_NULLABLE,
});

export const PROCESS_NULL: Partial<IWorkProcess> = {
	problems_uuid: [],
	problem_statement: null,
	status: undefined,
	status_update_date: undefined,
	is_transferred_for_qc: undefined,
	is_ready_for_delivery: undefined,
	warehouse_uuid: undefined,
	rack_uuid: undefined,
	floor_uuid: undefined,
	box_uuid: undefined,
	remarks: null,
};
export type IWorkProcess = z.infer<typeof PROCESS_SCHEMA>;

//* Transfer Process Section Schema
export const TRANSFER_PROCESS_SECTION_SCHEMA = z.object({
	entry: z.array(
		z.object({
			uuid: STRING_OPTIONAL,
			section_uuid: STRING_OPTIONAL,
			remarks: STRING_NULLABLE,
		})
	),
});
export const TRANSFER_PROCESS_SECTION_NULL: Partial<IWorkTransfer> = {
	entry: [
		{
			uuid: undefined,
			section_uuid: '',
			remarks: null,
		},
	],
};
export type IWorkTransfer = z.infer<typeof TRANSFER_PROCESS_SECTION_SCHEMA>;

//* Zone Schema
export const ZONE_SCHEMA = z.object({
	name: STRING_OPTIONAL,
	division: STRING_REQUIRED,
	latitude: STRING_OPTIONAL,
	longitude: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const ZONE_NULL: Partial<IWorkZone> = {
	name: '',
	division: '',
	latitude: undefined,
	longitude: undefined,
	remarks: null,
};
export type IWorkZone = z.infer<typeof ZONE_SCHEMA>;

//* Accessories Schema
export const ACCESSORIES_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const ACCESSORIES_NULL: Partial<IAccessories> = {
	uuid: '',
	name: '',
	remarks: null,
};
export type IAccessories = z.infer<typeof ACCESSORIES_SCHEMA>;
//* Transfer Schema
export const TRANSFER_SCHEMA = z.object({
	purchase_entry_uuid: STRING_REQUIRED,
	warehouse_uuid: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});

export const TRANSFER_NULL: Partial<ITransfer> = {
	warehouse_uuid: '',
	purchase_entry_uuid: '',
	remarks: null,
};

export type ITransfer = z.infer<typeof TRANSFER_SCHEMA>;

//* Info Pop Up
export const INFO_POPUP_SCHEMA = z.object({
	customer_feedback: STRING_OPTIONAL,
	is_contact_with_customer: BOOLEAN_OPTIONAL.default(false),
	order_info_status: z.enum(['accepted', 'pending', 'rejected', 'cancel']).optional(),
});
export const INFO_POPUP_NULL: Partial<IInfoPopup> = {
	customer_feedback: '',
	is_contact_with_customer: false,
	order_info_status: 'pending',
};
export type IInfoPopup = z.infer<typeof INFO_POPUP_SCHEMA>;